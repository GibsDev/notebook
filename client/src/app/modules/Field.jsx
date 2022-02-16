import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clipboard from 'clipboardy';
import { useApolloClient, gql, useMutation, useLazyQuery } from '@apollo/client';

import IconButton from '../components/IconButton';
import UpdateButtons from '../components/UpdateButtons';

import cipher from '../lib/cipher';

const clipDefaultIcon = 'lucide:clipboard';
const clipCheckedIcon = 'lucide:clipboard-check';

function isLink(text) {
    try {
        new URL(text);
    } catch {
        return false;
    }
    return true;
}

const GET_FIELD = gql(`
query ($id: String){
    getField(id: $id) {
        name
        data
        secret
    }
}`);

const UPDATE_FIELD = gql(`
mutation ($id: String!, $name: String, $data: String, $secret: Boolean) {
    updateField(id: $id, name: $name, data: $data, secret: $secret) {
        name
        data
        secret
    }
}`);

const MOVE_FIELD = gql(`
mutation ($id: String!, $relativeIndex: Int!) {
    moveField(id: $id, relativeIndex: $relativeIndex)
}`);

const DELETE_FIELD = gql(`
mutation ($id: String!) {
    deleteField(id: $id) {
        id
    }
}`);


Field.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    encryptionKey: PropTypes.string,
    onDeleted: PropTypes.func,
    onMoved: PropTypes.func,
    editable: PropTypes.bool
};

function Field({ className, id, encryptionKey, onDeleted, onMoved, editable = false }) {

    const client = useApolloClient();

    const [name, setName] = useState('');
    const [data, setData] = useState('');
    const [syncedData, syncData] = useState(data);
    const [syncedName, syncName] = useState(name);
    const [clipIcon, setClipIcon] = useState(clipDefaultIcon);
    const [deleting, setDeleting] = useState(false);
    const [secret, setSecret] = useState(true);

    const [sync, qSync] = useLazyQuery(
        GET_FIELD,
        {
            variables: {
                id
            },
            onCompleted: () => {
                const rawField = qSync.data.getField;
                const decName = decrypt(rawField.name);
                const decData = decrypt(rawField.data);
                // Delete empty fields on load
                // This can happen if the user reloads the page while editing and they have empty fields
                if (!editable && !decName && !decData) {
                    deleteSelf();
                    return;
                }
                syncName(decName);
                syncData(decData);
                setName(decName);
                setData(decData);
                setSecret(rawField.secret);
            }
        }
    );

    const [deleteSelf/*, qDelete */] = useMutation(
        DELETE_FIELD,
        {
            variables: {
                id
            },
            onCompleted: () => {
                onDeleted();
            }
        }
    );

    const { encrypt, decrypt } = cipher(encryptionKey);

    useEffect(() => {
        sync();
        return () => { };
    }, []);

    useEffect(() => {
        // Delete empty fields when exiting edit mode
        // This may cause multiple asynchronous queries to be sent to prisma
        // SQLite database could not handle these concurrent requests
        if (!editable) {
            if (qSync.called
                && !qSync.loading
                && qSync.data
                && !syncedName
                && !syncedData) {
                deleteSelf();
            } else {
                resetData();
            }
        }
    }, [editable]);

    // Reset clipboard icon
    useEffect(() => {
        if (clipIcon != clipDefaultIcon) {
            setTimeout(() => {
                setClipIcon(clipDefaultIcon);
            }, 1500);
        }
    }, [clipIcon]);

    function resetData() {
        setData(syncedData);
        setName(syncedName);
    }

    async function submit() {
        try {
            const mutate = await client.mutate({
                mutation: UPDATE_FIELD,
                variables: {
                    id,
                    name: encrypt(name),
                    data: encrypt(data)
                }
            });
            const rawField = mutate.data.updateField;
            const decName = decrypt(rawField.name);
            const decData = decrypt(rawField.data);
            syncName(decName);
            syncData(decData);
        } catch (e) {
            console.log(e.message);
        }

    }

    // Handlers

    function dataFieldChanged(e) {
        if (editable) {
            setData(e.target.value);
        }
    }

    function nameFieldChanged(e) {
        if (editable) {
            setName(e.target.value);
        }
    }

    function onKeyDown(e) {
        if (e.key === 'Enter') {
            submit();
            e.target.blur();
        } else if (e.key === 'Escape') {
            setName(syncedName);
            setData(syncedData);
            e.target.blur();
        }
    }

    async function moveFieldUp() {
        await client.mutate({
            mutation: MOVE_FIELD,
            variables: {
                id,
                relativeIndex: -1
            }
        });
        onMoved();
    }

    async function moveFieldDown() {
        await client.mutate({
            mutation: MOVE_FIELD,
            variables: {
                id,
                relativeIndex: 1
            }
        });
        onMoved();
    }

    function copy() {
        clipboard.write(syncedData).then(() => {
            setClipIcon(clipCheckedIcon);
        });
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

    async function toggleSecret() {
        const current = secret;
        // Change immediately for responsive feedback
        setSecret(!current);
        try {
            const mutate = await client.mutate({
                mutation: UPDATE_FIELD,
                variables: {
                    id,
                    secret: !current
                }
            });
            const { secret: syncedSecret } = mutate.data.updateField;
            // Ensure the server agrees
            setSecret(syncedSecret);
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <div className={('input-group ' + className).trim()}>
            { // Delete confirm
                editable && deleting && (
                    <button className="btn btn-danger delete-button"
                        title="Confirm Delete"
                        onClick={deleteSelf}>Delete</button>
                )
            }

            { // Move up
                editable && (
                    <IconButton title="Move Up"
                        size="sm"
                        icon="bi:arrow-up-short"
                        onClick={moveFieldUp} />
                )
            }

            { // Move down
                editable && (
                    <IconButton title="Move Down"
                        size="sm"
                        icon="bi:arrow-down-short"
                        onClick={moveFieldDown} />
                )
            }

            { // Field name
                editable ? (
                    <input className="form-control"
                        autoComplete="off"
                        value={name}
                        onChange={nameFieldChanged}
                        onKeyDown={onKeyDown} />
                ) : (
                    <span className="input-group-text">{name}</span>
                )
            }

            { // Clipboard
                !editable && (
                    <IconButton tabIndex={-1}
                        title="Copy"
                        icon={clipIcon}
                        onClick={copy} />
                )
            }

            { // Secret button
                (secret || editable) && (
                    <IconButton className={(secret && !editable) ? 'flex-grow-1' : ''}
                        tabIndex={-1}
                        size="sm"
                        icon={(secret && editable) ? 'ic:outline-visibility' : 'ic:outline-visibility-off'}
                        onClick={toggleSecret}
                        title={(secret) ? 'Show Data' : 'Hide Data'}
                        disabled={secret && !editable} />
                )
            }

            { // Field value
                (editable || !secret) && (
                    <input type={secret ? 'password' : 'text'}
                        className="form-control bg-white"
                        autoComplete="off"
                        value={data}
                        onChange={dataFieldChanged}
                        onKeyDown={onKeyDown}
                        aria-label={name}
                        aria-describedby={id}
                        readOnly={!editable} />
                )
            }

            { // Update buttons
                editable && (data !== syncedData || name !== syncedName) &&
                <UpdateButtons onApply={submit} onCancel={resetData} />
            }

            { // Delete initiate button
                editable && (
                    <IconButton icon="carbon:delete"
                        size="sm"
                        onClick={toggleDeleting}
                        title="Delete" />
                )
            }

            { // Link button
                (!editable && isLink(syncedData)) && (
                    <IconButton icon="ci:external-link"
                        href={syncedData} />
                )
            }
        </div>
    );
}

export default Field; // TODO memo?