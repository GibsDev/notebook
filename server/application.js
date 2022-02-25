// Defines all the core application functionality
var crypto = require('crypto');
const { v4: uuid } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const email = require('./email');

const prisma = new PrismaClient();

/**
 * @param {String} ctxUserId The id of the user making the request
 */
module.exports = (ctxUserId) => {

    // Helper functions

    function passwordHash(password, salt) {
        return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    }

    /**
     * Update a note to update the updatedAt field (doesn't actually modify)
     * @returns The note that was updated
     */
    function emptyNoteUpdate(noteId) {
        return prisma.note.update({
            where: {
                id: noteId
            },
            data: {
                id: noteId
            }
        });
    }

    // AUTHENTICATION FUNCTIONS

    function createUser() {
        return prisma.user.create({
            data: {
                id: uuid(),
                collapseNotes: false
            }
        });
    }

    async function registerWallet(address) {
        return prisma.$transaction(async (prisma) => {
            // Check if it exists
            const wallet = await prisma.wallet.findFirst({
                where: {
                    address
                }
            });
            if (wallet) {
                return null;
            }
            // Create it otherwise
            const newWallet = await prisma.wallet.create({
                data: {
                    address
                }
            });
            return newWallet;
        });
    }

    async function linkWallet(address) {
        await prisma.wallet.deleteMany({
            where: {
                address
            }
        });
        return prisma.$transaction(async (prisma) => {
            await registerWallet(address);
            return await prisma.user.update({
                where: {
                    id: ctxUserId
                },
                data: {
                    wallet: {
                        connect: {
                            address
                        }
                    }
                },
                include: {
                    wallet: true,
                    login: true
                }
            });
        });
    }

    async function registerLogin(username, password) {
        username = username.toLowerCase();
        return prisma.$transaction(async (prisma) => {
            // Check if it exists
            const login = await prisma.login.findFirst({
                where: {
                    username
                }
            });
            if (login) {
                throw new Error('Username taken');
            }
            // Create it otherwise
            email({
                subject: 'A new login has been created',
                text: `User '${username}' has created a login`
            });
            const salt = crypto.randomBytes(16).toString('hex');
            return prisma.login.create({
                data: {
                    username,
                    password: passwordHash(password, salt),
                    salt
                }
            });
        });
    }

    /**
     * @returns the login user with the given credentials or null
     */
    async function verifyLogin(username, password) {
        username = username.toLowerCase();
        return prisma.$transaction(async (prisma) => {
            const login = await prisma.login.findFirst({
                where: {
                    username
                }
            });
            if (login === null) {
                throw new Error('Invalid username');
            }
            if (login.password !== passwordHash(password, login.salt)) {
                throw new Error('Invalid password');
            }
            return login;
        });
    }


    async function linkLogin(username, userId) {
        username = username.toLowerCase();
        return prisma.$transaction(async (prisma) => {
            const login = await prisma.login.findFirst({
                where: {
                    username
                }
            });
            if (login && login.userId) {
                return null;
            }
            return prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    login: {
                        connect: {
                            username
                        }
                    }
                },
                include: {
                    login: true,
                    wallet: true
                }
            });
        });
    }

    async function hasLogin(username) {
        username = username.toLowerCase();
        const login = await prisma.login.findFirst({
            where: {
                username
            }
        });
        return login !== null;
    }

    function getUserFromAddress(address) {
        return prisma.user.findFirst({
            where: {
                wallet: {
                    address
                }
            }
        });
    }

    function getUserFromUsername(username) {
        username = username.toLowerCase();
        return prisma.user.findFirst({
            where: {
                login: {
                    username
                }
            }
        });
    }

    const authentication = {
        createUser,

        registerLogin,
        verifyLogin,
        linkLogin,
        hasLogin,

        linkWallet,

        getUserFromAddress,
        getUserFromUsername
    };

    // MUTATION FUNCTIONS

    async function setNickname(nickname) {
        const user = await prisma.user.update({
            where: {
                id: ctxUserId
            },
            data: {
                nickname
            }
        });
        return user.nickname;
    }

    async function setCollapseNotes(collapse) {
        const user = await prisma.user.update({
            where: {
                id: ctxUserId
            },
            data: {
                collapseNotes: collapse
            }
        });
        return user.collapseNotes;
    }

    async function createNote(keyId, title, body) {
        return prisma.note.create({
            data: {
                keyId,
                title,
                body,
                user: {
                    connect: {
                        id: ctxUserId
                    }
                }
            }
        });
    }

    async function updateNote(noteId, title, body) {
        return prisma.$transaction(async (prisma) => {
            const note = await prisma.note.findFirst({
                where: {
                    id: noteId
                }
            });
            if (note.userId !== ctxUserId) {
                throw new Error('Permission denied');
            }
            return prisma.note.update({
                where: {
                    id: noteId
                },
                data: {
                    title,
                    body,
                }
            });
        });
    }

    async function deleteNote(noteId) {
        return prisma.$transaction(async (prisma) => {
            const note = await prisma.note.findFirst({
                where: {
                    id: noteId
                }
            });
            if (note.userId !== ctxUserId) {
                throw new Error('Permission denied');
            }
            await prisma.field.deleteMany({
                where: {
                    note: {
                        id: noteId,
                        userId: ctxUserId
                    }
                }
            });
            await prisma.note.deleteMany({
                where: {
                    id: noteId,
                    userId: ctxUserId
                }
            });
            return noteId;
        });
    }

    async function createField(noteId, name, data, secret) {
        return prisma.$transaction(async (prisma) => {
            const note = await prisma.note.findFirst({
                where: {
                    id: noteId
                },
                include: {
                    fields: {
                        orderBy: {
                            index: 'asc'
                        }
                    }
                }
            });
            if (note.userId !== ctxUserId) {
                throw new Error('Permission denied');
            }
            let index = 0;
            if (note.fields.length > 1) {
                index = note.fields[note.fields.length - 1].index + 1;
            }
            const field = await prisma.field.create({
                data: {
                    name,
                    data,
                    index,
                    secret,
                    note: {
                        connect: {
                            id: noteId
                        }
                    }
                }
            });
            await emptyNoteUpdate(noteId);
            return field;
        });
    }

    async function updateField(fieldId, name, data, secret, index) {
        return prisma.$transaction(async (prisma) => {
            const note = await prisma.note.findFirst({
                where: {
                    fields: {
                        some: {
                            id: fieldId
                        }
                    }
                }
            });
            if (note.userId !== ctxUserId) {
                throw new Error('Permission denied');
            }
            const field = await prisma.field.update({
                where: {
                    id: fieldId
                },
                data: {
                    name,
                    data,
                    secret,
                    index
                }
            });
            await emptyNoteUpdate(note.id);
            return field;
        });
    }

    async function moveField(fieldId, relativeIndex) {
        return prisma.$transaction(async (prisma) => {
            const field = await prisma.field.findFirst({
                where: {
                    id: fieldId
                },
                include: {
                    note: true
                }
            });
            if (field.note.userId !== ctxUserId) {
                throw new Error('Permission denied');
            }
            if (relativeIndex == 0) {
                return new Error('Relative index should not be 0');
            }
            const noteId = field.noteId;
            const fields = await prisma.field.findMany({
                where: {
                    noteId
                },
                orderBy: {
                    index: 'asc'
                }
            });
            // Normalize order
            fields.forEach((field, index) => { field.index = index; });
            // Get the field that is moving
            const mover = fields.filter(field => field.id == fieldId)[0];
            let newIndex = mover.index;
            if (relativeIndex < 0) {
                newIndex += (relativeIndex - 0.5);
            } else if (relativeIndex > 0) {
                newIndex += (relativeIndex + 0.5);
            }
            mover.index = newIndex;
            const sorted = fields.sort((a, b) => a.index - b.index);
            let counter = 0;
            const newOrder = [];
            for (const field of sorted) {
                field.index = counter;
                await prisma.field.update({
                    where: {
                        id: field.id
                    },
                    data: field
                });
                newOrder.push(field.id);
                counter++;
            }
            await emptyNoteUpdate(noteId);
            return newOrder;
        });
    }

    async function deleteField(fieldId) {
        return prisma.$transaction(async (prisma) => {
            // We could updated indexes here, but it makes no functional difference
            const note = await prisma.note.findFirst({
                where: {
                    fields: {
                        some: {
                            id: fieldId
                        }
                    }
                }
            });
            if (!note) {
                throw new Error('Field does not exist');
            }
            if (note.userId !== ctxUserId) {
                throw new Error('Permission denied');
            }
            const field = await prisma.field.delete({
                where: {
                    id: fieldId
                }
            });
            if (field) {
                await emptyNoteUpdate(field.noteId);
            }
            return field;
        });
    }

    const mutation = {
        setNickname,
        setCollapseNotes,
        createNote,
        updateNote,
        deleteNote,
        createField,
        updateField,
        moveField,
        deleteField
    };

    // QUERY FUNCTIONS

    function getUser(userId) {
        if (userId !== ctxUserId) {
            throw new Error('Permission denied');
        }
        return prisma.user.findFirst({
            where: {
                id: userId
            }
        });
    }

    function getNotes(userId, keyId) {
        if (userId !== ctxUserId) {
            throw new Error('Permission denied');
        }
        return prisma.note.findMany({
            where: {
                userId,
                keyId
            }
        });
    }

    async function getNote(noteId) {
        const note = await prisma.note.findFirst({
            where: {
                id: noteId
            }
        });
        if (note.userId !== ctxUserId) {
            throw new Error('Permission denied');
        }
        return note;
    }

    async function getField(fieldId) {
        const field = await prisma.field.findFirst({
            where: {
                id: fieldId
            },
            include: {
                note: true
            }
        });
        if (field.note.userId !== ctxUserId) {
            throw new Error('Permission denied');
        }
        delete field.note;
        return field;
    }

    async function getFields(noteId) {
        const note = await prisma.note.findFirst({
            where: {
                id: noteId
            },
            include: {
                fields: true
            }
        });
        if (note.userId !== ctxUserId) {
            throw new Error('Permission denied');
        }
        return note.fields;
    }

    const query = {
        getUser,
        getNote,
        getNotes,
        getField,
        getFields
    };

    // RELATIONAL RESOLVER FUNCTIONS

    async function getUserFromNote(noteId) {
        const note = await prisma.note.findFirst({
            where: {
                id: noteId
            },
            include: {
                user: true
            }
        });
        if (ctxUserId !== note.user.id) {
            throw new Error('Permission denied');
        }
        return note.user;
    }

    async function getNoteFromField(fieldId) {
        const field = await prisma.field.findFirst({
            where: {
                id: fieldId
            },
            include: {
                note: true
            }
        });
        if (ctxUserId !== field.note.userId) {
            throw new Error('Permission denied');
        }
        return field.note;
    }

    async function getUserFromField(fieldId) {
        return prisma.$transaction(async (prisma) => {
            const note = await getNoteFromField(fieldId);
            return prisma.user.findFirst({
                where: {
                    id: note.userId
                }
            });
        });
    }

    async function getUsername() {
        const login = await prisma.login.findFirst({
            where: {
                userId: ctxUserId
            }
        });
        if (login) {
            return login.username;
        }
        return null;
    }

    async function getAddress() {
        const wallet = await prisma.wallet.findFirst({
            where: {
                userId: ctxUserId
            }
        });
        if (wallet) {
            return wallet.address;
        }
        return null;
    }

    const relations = {
        // getNotes
        // getFields
        getUserFromNote,
        getNoteFromField,
        getUserFromField,
        getUsername,
        getAddress
    };


    return {
        ...authentication,
        ...mutation,
        ...query,
        ...relations
    };
};
