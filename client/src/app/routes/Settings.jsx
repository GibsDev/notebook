import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { AuthContext } from '../Authentication';
import UpdateButtons from '../components/UpdateButtons';

export default function Settings() {

    const { user, nickname, collapseNotes, changeNickname, setCollapsedByDefault, username, address, web3Token } = useContext(AuthContext);

    const [isUser, setIsUser] = useState(false);

    function nick() {
        if (nickname) {
            return nickname;
        }
        return '';
    }

    const [nicknameField, setNicknameField] = useState(nick());

    useEffect(() => {
        if (nickname) {
            setNicknameField(nickname);
        } else {
            setNicknameField('');
        }
    }, [nickname]);

    useEffect(() => {
        if (username || address) {
            setIsUser(username !== null);
        }
    }, [username, address]);

    function resetNickname() {
        setNicknameField(nick());
    }

    function updateNickname() {
        setNicknameField(nick());
        changeNickname(nicknameField ? nicknameField : null);
    }

    function handleNicknameFieldChanged(e) {
        setNicknameField(e.target.value);
    }

    function setCollapseNotes(e) {
        setCollapsedByDefault(e.currentTarget.checked);
    }

    function onNicknameKeyPressed(e) {
        if (e.key === 'Enter') {
            updateNickname();
            e.target.blur();
        }
    }

    async function link() {
        const token = await web3Token('1m');
        const res = await fetch('/auth/link', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                token
            })
        });
        if (!res.ok) {
            const err = await res.text();
            toast.error(err);
            console.error(err);
        } else {
            toast(await res.text());
        }
    }

    return (
        <div className="d-flex flex-column gap-2 my-3">
            <h2>Settings</h2>
            <p className="mb-0">You are logged in as <code>{user}</code></p>
            <div className="input-group">
                <span className="input-group-text" if="nickname">Nickname</span>

                <input className="form-control" type="text"
                    aria-label="Nickname"
                    area-described-by="nickname"
                    value={nicknameField}
                    onChange={handleNicknameFieldChanged}
                    onKeyPress={onNicknameKeyPressed} />

                { // Apply and cancel buttons
                    nicknameField !== nick() &&
                    <UpdateButtons onCancel={resetNickname} onApply={updateNickname} />
                }
            </div>

            <div className="input-group d-flex">
                <span className="input-group-text flex-grow-1" id="collapseLabel">Collapse notes by default</span>

                <div className="input-group-text">
                    <input type="checkbox" className="for-check-input" aria-labelledby="collapseLabel" onChange={setCollapseNotes} checked={collapseNotes} />
                </div>
            </div>

            {
                isUser &&
                <button className='btn btn-secondary' onClick={link}>Link wallet</button>
            }
        </div>
    );
}