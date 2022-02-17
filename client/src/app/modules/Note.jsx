import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useApolloClient, gql, useLazyQuery } from '@apollo/client';

import Field from './Field';
import UpdateButtons from '../components/UpdateButtons';
import IconButton from '../components/IconButton';
import { AuthContext } from '../Authentication';

import cipher from '../lib/cipher';

const GET_NOTE = gql(`
query ($id: String) {
    getNote(id: $id) {
        title
        body
        createdAt
        updatedAt
        fields {
            id
            index
        }
    }
}`);

const UPDATE_NOTE = gql(`
mutation ($id: String!, $title: String, $body: String) {
    updateNote(id: $id, title: $title, body: $body) {
        title
        body
    }
}`);

const CREATE_FIELD = gql(`
mutation ($noteId: String!) {
    createField(noteId: $noteId) {
        id
    }
}`);

const DELETE_NOTE = gql(`
mutation ($id: String!) {
    deleteNote(id: $id)
}`);

Note.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    encryptionKey: PropTypes.string,
    query: PropTypes.string,
    onDeleted: PropTypes.func
};

function Note({ className, id, encryptionKey, query, onDeleted }) {

    const client = useApolloClient();

    const { collapseNotes } = useContext(AuthContext);

    const [title, setTitle] = useState(undefined);
    const [syncedTitle, setSyncedTitle] = useState(title);
    const [body, setBody] = useState(undefined);
    const [syncedBody, setSyncedBody] = useState(body);
    const [fieldIds, setFieldIds] = useState([]);
    const [editable, setEditable] = useState(false);
    const [collapsed, setCollapsed] = useState(collapseNotes);
    const [deleting, setDeleting] = useState(false);
    const [visible, setVisible] = useState(true);
    const [createdAt, setCreatedAt] = useState(null);
    const [updatedAt, setUpdatedAt] = useState(null);

    const { encrypt, decrypt } = cipher(encryptionKey);

    const [sync/*, qSync */] = useLazyQuery(
        GET_NOTE,
        {
            variables: {
                id
            },
            onCompleted: res => {
                const rawNote = res.getNote;
                parseRawNote(rawNote);
            }
        },
    );

    function parseRawNote({ title: serverTitle, body: serverBody, createdAt, updatedAt, fields }) {
        if (serverTitle) {
            const decTitle = decrypt(serverTitle);
            if (title === undefined) {
                setTitle(decTitle);
            }
            setSyncedTitle(decTitle);
        }
        if (serverBody) {
            const decBody = decrypt(serverBody);
            if (body === undefined) {
                setBody(decBody);
            }
            setSyncedBody(decBody);
        }
        if (fields) {
            const fieldIds = fields.map(f => f.id);
            setFieldIds(fieldIds);
        }
        if (createdAt) {
            setCreatedAt(new Date(createdAt));
        }
        if (updatedAt) {
            setUpdatedAt(new Date(updatedAt));
        }
    }

    useEffect(() => {
        sync();
        return () => { };
    }, []);

    useEffect(() => {
        setVisible(!query
            || (syncedTitle && syncedTitle.toLowerCase().includes(query.toLowerCase()))
            || (syncedBody && syncedBody.toLowerCase().includes(query.toLowerCase())));
    }, [query, syncedTitle, syncedBody]);

    useEffect(() => {
        resetData();
    }, [editable]);

    if (!visible) {
        return null;
    }

    async function submitTitle() {
        try {
            const mutate = await client.mutate({
                mutation: UPDATE_NOTE,
                variables: {
                    id,
                    title: encrypt(title)
                }
            });
            const rawNote = mutate.data.updateNote;
            parseRawNote(rawNote);
        } catch (e) {
            console.log(e.message);
        }
    }

    async function submitBody() {
        try {
            const mutate = await client.mutate({
                mutation: UPDATE_NOTE,
                variables: {
                    id,
                    body: encrypt(body)
                }
            });
            const rawNote = mutate.data.updateNote;
            parseRawNote(rawNote);
        } catch (e) {
            console.log(e.message);
        }
    }

    function resetData() {
        setBody(syncedBody);
        setTitle(syncedTitle);
        setDeleting(false);
    }

    function toggleEdit() {
        if (!editable) {
            setCollapsed(false);
        }
        setEditable(!editable);
    }

    function toggleCollapse() {
        if (!collapsed) {
            setEditable(false);
        }
        setCollapsed(!collapsed);
    }

    function onBodyInputChanged(e) {
        setBody(e.target.value);
    }

    function onTitleInputChanged(e) {
        setTitle(e.target.value);
    }

    function titleKeyDown(e) {
        if (e.key === 'Enter') {
            submitTitle();
            e.target.blur();
        } else if (e.key === 'Escape') {
            setTitle(syncedTitle);
            e.target.blur();
        }
    }

    function bodyKeyDown(e) {
        if (e.key === 'Escape') {
            setBody(syncedBody);
            e.target.blur();
        }
    }

    async function createField() {
        try {
            await client.mutate({
                mutation: CREATE_FIELD,
                variables: {
                    noteId: id
                }
            });
            sync();
        } catch (e) {
            console.log(e.message);
        }
    }

    function toggleDeleting() {
        if (!deleting) {
            // Clicking anywhere but the delete button cancels the delete
            document.addEventListener('click', (e) => {
                if (e.target && e.target.className && e.target.className.includes) {
                    if (e.target.className.includes('delete-button')) {
                        return;
                    }
                }
                setDeleting(false);
                e.stopPropagation();
            }, { capture: true, once: true });
        }
        setDeleting(!deleting);
    }

    async function deleteNote() {
        try {
            const mutate = await client.mutate({
                mutation: DELETE_NOTE,
                variables: {
                    id
                }
            });
            onDeleted(mutate.data.deleteNote);
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
        <div className={('card ' + className).trim()}>
            <div className="card-header d-flex gap-2 align-items-center">
                { // Delete confirm
                    editable && deleting && (
                        <button className="btn btn-danger delete-button"
                            title="Confirm Delete"
                            onClick={deleteNote}>Delete</button>
                    )
                }

                { // Note title
                    editable ? (
                        <div className="input-group">
                            <input className="form-control"
                                type="text"
                                value={title}
                                placeholder="Title"
                                onChange={onTitleInputChanged}
                                onKeyDown={titleKeyDown} />

                            { // Apply cancel buttons
                                title !== syncedTitle &&
                                <UpdateButtons onCancel={resetData} onApply={submitTitle} />
                            }
                        </div>
                    ) : (
                        <span className="card-text flex-grow-1"
                            title={
                                createdAt && updatedAt &&
                                `Updated: ${updatedAt.toLocaleString()}\nCreated: ${createdAt.toLocaleString()}`
                            }>{title}</span>
                    )
                }

                { // Delete initiate
                    editable && (
                        <IconButton icon="carbon:delete"
                            size="sm"
                            title="Delete Note"
                            onClick={toggleDeleting} />
                    )
                }

                <IconButton icon="ep:edit-pen"
                    size="sm"
                    variant={editable ? 'secondary' : 'outline-secondary'}
                    title={(editable ? 'Exit' : 'Enter') + ' Edit mode'}
                    onClick={toggleEdit} />

                <IconButton size="sm"
                    icon={collapsed ? 'bx:bx-expand-vertical' : 'bx:bx-collapse-vertical'}
                    title={collapsed ? 'Expand' : 'Collapse'}
                    onClick={toggleCollapse} />
            </div>

            {
                // Use d-none instead of omitting the element so that Field components will still receive 'editable' update
                <div className={collapsed ? 'd-none' : 'd-flex' + ' flex-column gap-3 card-body'}>
                    { // Note body
                        editable ? (
                            <div className="input-group">
                                <textarea className="form-control"
                                    placeholder="Body"
                                    value={body}
                                    onChange={onBodyInputChanged}
                                    onKeyDown={bodyKeyDown}/>

                                { // Apply and cancel buttons
                                    body !== syncedBody &&
                                    <UpdateButtons onCancel={resetData} onApply={submitBody} />
                                }
                            </div>
                        ) : (
                            body && // Dont show if body is empty
                            <pre className="card-text mb-0"
                                style={{
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit'
                                }}>{body}</pre>
                        )
                    }

                    {
                        (editable || fieldIds.length > 0) &&
                        <div className="d-flex flex-column gap-2">
                            {
                                fieldIds.map(id =>
                                    <Field id={id}
                                        key={id}
                                        encryptionKey={encryptionKey}
                                        editable={editable}
                                        onDeleted={sync}
                                        onMoved={sync} />
                                )
                            }

                            { // Add field button
                                editable && (
                                    <IconButton icon="akar-icons:plus"
                                        title="Add Field"
                                        onClick={createField} />
                                )
                            }
                        </div>
                    }
                </div>
            }
        </div>
    );
}

export default Note;