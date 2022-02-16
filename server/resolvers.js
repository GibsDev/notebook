const noteApp = require('./application.js');

// Add this to simulate processing delay
function sleep(ms) {
    return new Promise(res => {
        setTimeout(res, ms);
    });
}

module.exports = {
    Query: {
        ping: async () => {
            await sleep(500);
            return 'pong';
        },
        getUser: (_, params, context) => {
            return noteApp(context.user).getUser(context.user);
        },
        getNotes: (_, { keyId = null }, context) => {
            return noteApp(context.user).getNotes(context.user, keyId);
        },
        getNote: (_, { id }, context) => {
            return noteApp(context.user).getNote(id);
        },
        getField: (_, { id }, context) => {
            return noteApp(context.user).getField(id);
        },
    },
    Mutation: {
        setNickname: (_, { nickname }, context) => {
            return noteApp(context.user).setNickname(nickname);
        },
        setCollapseNotes: (_, { collapse }, context) => {
            return noteApp(context.user).setCollapseNotes(collapse);
        },
        createNote: (_, { keyId = null, title = '', body = '' }, context) => {
            return noteApp(context.user).createNote(keyId, title, body);
        },
        updateNote: (_, { id, title, body }, context) => {
            return noteApp(context.user).updateNote(id, title, body);
        },
        deleteNote: (_, { id }, context) => {
            return noteApp(context.user).deleteNote(id);
        },
        createField: (_, { name = '', data = '', secret = false, noteId }, context) => {
            return noteApp(context.user).createField(noteId, name, data, secret);
        },
        updateField: (_, { id, name, data, secret, index }, context) => {
            return noteApp(context.user).updateField(id, name, data, secret, index);
        },
        moveField: (_, { id, relativeIndex }, context) => {
            return noteApp(context.user).moveField(id, relativeIndex);
        },
        deleteField: (_, { id }, context) => {
            return noteApp(context.user).deleteField(id);
        },
    },
    User: {
        notes: (user, _, context) => {
            return noteApp(context.user).getNotes(user.id);
        },
        username: (user, _, context) => {
            return noteApp(context.user).getUsername(user.id);
        },
        address: (user, _, context) => {
            return noteApp(context.user).getAddress(user.id);
        }
    },
    Note: {
        fields: (note, _, context) => {
            return noteApp(context.user).getFields(note.id);
        },
        user: (note, _, context) => {
            return noteApp(context.user).getUserFromNote(note.userId);
        },
        userId: async (note, _, context) => {
            return (await noteApp(context.user).getUserFromNote(note.userId)).id;
        }
    },
    Field: {
        note: (field, _, context) => {
            return noteApp(context.user).getNoteFromField(field.id);
        },
        user: (field, _, context) => {
            return noteApp(context.user).getUserFromField(field.id);
        },
        userId: async (field, _, context) => {
            return (await noteApp(context.user).getUserFromField(field.id)).id;
        }
    }
};