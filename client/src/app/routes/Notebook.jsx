import { useContext, useState, useEffect } from 'react';
import sha256 from 'crypto-js/sha256';
import { useApolloClient, gql, useLazyQuery } from '@apollo/client';
import { Icon } from '@iconify/react';

import Note from '../modules/Note';
import { AuthContext } from '../Authentication';
import IconButton from '../components/IconButton';

import cipher from '../lib/cipher';
import PasswordGenerator from '../modules/PasswordGenerator';

const GET_NOTES = gql(`
query ($keyId: String) {
    getNotes(keyId: $keyId) {
        id
        updatedAt
    }
}`);

const CREATE_NOTE = gql(`
mutation ($title: String, $keyId: String){
    createNote(title: $title, keyId: $keyId) {
        id
    }
}`);

export default function Notebook() {

    const client = useApolloClient();

    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState('');
    const [noteIds, setNoteIds] = useState([]);
    const [keyInput, setKeyInput] = useState('');
    const [currentKey, setKey] = useState('');
    const [encryptionKey, setEncryptionKey] = useState(null);
    const [keyId, setKeyId] = useState(null);
    const [pwdGen, setPwdGen] = useState(false);

    const { encrypt } = cipher(encryptionKey);

    const [sync/*, qSync */] = useLazyQuery(
        GET_NOTES,
        {
            variables: {
                keyId
            },
            onCompleted: res => {
                const notes = res.getNotes;
                const sorted = notes.sort((a, b) => {
                    const aDate = new Date(a.updatedAt).valueOf();
                    const bDate = new Date(b.updatedAt).valueOf();
                    return bDate - aDate;
                });
                const ids = sorted.map(note => note.id);
                setNoteIds(ids);
            }
        },
    );

    function updateKey() {
        const seed = user + currentKey;
        const seedHash = sha256(seed).toString();
        setEncryptionKey(seedHash);
        const keyHash = sha256(seedHash).toString();
        setKeyId(keyHash);
    }

    useEffect(() => {
        updateKey();
    }, [user]);

    useEffect(() => {
        if (user) {
            updateKey();
        } else {
            setEncryptionKey(null);
            setKeyId(null);
        }
    }, [currentKey]);

    useEffect(() => {
        sync();
    }, [keyId]);

    function togglePwdGen() {
        setPwdGen(!pwdGen);
    }

    async function createNote() {
        try {
            const mutate = await client.mutate({
                mutation: CREATE_NOTE,
                variables: {
                    title: encrypt('Untitled note'),
                    keyId
                }
            });
            setNoteIds([mutate.data.createNote.id].concat(noteIds));
        } catch (e) {
            console.log(e.message);
        }
    }

    async function handleDelete(noteId) {
        setNoteIds(noteIds.filter(nid => nid !== noteId));
    }

    function applyKey() {
        setKey(keyInput);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.target.blur();
            applyKey();
        } else if (e.key === 'Escape') {
            e.target.blur();
            clearKey();
        }
    }

    function handleFilterKeyDown(e) {
        if (e.key === 'Enter') {
            e.target.blur();
        } else if (e.key === 'Escape') {
            e.target.blur();
            clearQuery();
        }
    }

    function onQueryChanged(e) {
        setQuery(e.target.value);
    }

    function clearQuery() {
        setQuery('');
    }

    function clearKey() {
        setKeyInput('');
        setKey('');
    }

    if (!user) {
        return <p className="my-3">You need to login to access this page</p>;
    }

    if (!encryptionKey) {
        return <p className="my-3">Generating client encryption key...</p>;
    }

    let noteElems = [];
    for (const noteId of noteIds) {
        noteElems.push(<Note encryptionKey={encryptionKey} query={query} id={noteId} key={noteId} onDeleted={handleDelete} />);
    }
    if (noteElems.length == 0 && user) {
        noteElems = <p>There are no notes available.</p>;
    }

    /// STOAPSDFOAFA SEFPAK SDFPAKSD FPAKSE FPAKSD FPAK SEPFKA SDPFKA SPEFK ASPDFK PASDK FPASK EFPAK SDFPAK SDFPK asdfasdfasdfasdfasdf f rgasrg adsf 
    return (
        <div className="d-flex flex-column gap-3 my-3">
            <div className="d-flex gap-2 align-items-stretch">
                <div className="d-flex gap-2 flex-wrap flex-md-nowrap flex-grow-1">
                    <div className="input-group">
                        <span className="input-group-text" id="key" title="Key">
                            <Icon icon="codicon:key" />
                        </span>

                        <input className="form-control"
                            type="password"
                            placeholder="Key"
                            autoComplete="new-password"
                            aria-describedby="key"
                            value={keyInput}
                            onChange={e => setKeyInput(e.target.value)}
                            onBlur={applyKey}
                            onKeyDown={handleKeyDown} />

                        { // Key apply button
                            currentKey !== keyInput &&
                            <IconButton icon="bi:check"
                                variant="outline-primary"
                                title="Apply"
                                onClick={applyKey} />
                        }

                        { // Key clear button
                            currentKey &&
                            <IconButton icon="carbon:delete"
                                variant="outline-warning"
                                onClick={clearKey} />
                        }
                    </div>

                    <div className="input-group">
                        <span className="input-group-text" id="filter" title="Filter">
                            <Icon icon="codicon:search" />
                        </span>

                        <input type="text"
                            className="form-control"
                            value={query}
                            placeholder="Filter"
                            aria-describedby="filter"
                            onChange={onQueryChanged}
                            onKeyDown={handleFilterKeyDown} />

                        { // Query clear button
                            query &&
                            <IconButton icon="carbon:delete"
                                variant="outline-warning"
                                onClick={clearQuery} />
                        }
                    </div>
                </div>

                <div className="d-flex flex-column flex-md-row gap-2">
                    <IconButton className="" icon="ph:password"
                        variant="secondary"
                        title="Password Generator" onClick={togglePwdGen} />

                    <IconButton className="" icon="codicon:new-file"
                        variant="secondary"
                        title="New Note" onClick={createNote} />
                </div>
            </div>

            {
                pwdGen &&
                <PasswordGenerator />
            }

            <div className="d-flex flex-column gap-3">
                {noteElems}
            </div>
        </div>
    );
}