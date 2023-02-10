import React, {useEffect, useState} from 'react';
import './App.scss';
import {User} from './model/User';
import FlipMove from 'react-flip-move';
import {getList, pushList} from './data-service';
import {colors} from './model/Colors';

function App() {

    const [userList, setUserList] = useState(getList());
    const [message, setMessage] = useState('');

    useEffect(() => {
        shuffle(userList);
        setUserList([...userList.sort((a, b) => a.type - b.type)]);
        pushList(userList);
    }, []);
    const onAddClick = () => {
        if (!message) {
            return;
        }
        userList.push({name: message, type: 0, uid: Math.random()});
        setUserList([...userList.sort((a, b) => a.type - b.type)]);
        setMessage('');
        pushList(userList);
    };

    const onCopyClick = () => {
        const text = userList.map((user, index) => {
            return (index+1) + '. '+user.name;
        }).join('\n');
       // Copy to clipboard
         navigator.clipboard.writeText(text);
    };
    const onDeleteClick = (user : User) => {
        setUserList([...userList.filter((u) => u !== user)]);
        pushList(userList);
    };

    const onCategoryClick = (user : User) => {
        user.type++;
        if(user.type >= colors.length) {
            user.type = 0;
        }
        setUserList([...userList]);
        pushList(userList);
    };

    const onRandomClick = () => {
        shuffle(userList);
        setUserList([...userList.sort((a, b) => a.type - b.type)]);
        pushList(userList);
    };

    const shuffle = (array: User[]): User[] => {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onAddClick();
        }
    }

    const renderUserCard = (user: User, index: number) => {
        return <li className={`card user`} key={user.uid+''}>
            <div className="user-type" style={{backgroundColor: colors[user.type]}} onClick={() => onCategoryClick(user)}/>
            {(index+1) +'. '+user.name}
            <button className="button icon" onClick={() => onDeleteClick(user)}>X</button>
        </li>;
    }

    return (
        <div className="app">
            <header className="header card">
                Kikoz
            </header>
            <div className="content">
                <div className="add-form">
                    <input className="input"  type="text" value={message} onKeyUp={handleKeyDown} onChange={handleChange}/>
                    <button className={`button ${message ? '' : 'disabled'}`} onClick={onAddClick}>Ajouter</button>
                </div>
                <button className="button" onClick={onRandomClick}>Lancer la génération 🔀</button>
                <FlipMove typeName="ol">
                    {userList.map((user, index) =>
                    {
                        return  <li className={`card user`} key={user.uid}>
                            <div className="user-type" style={{backgroundColor: colors[user.type]}} onClick={() => onCategoryClick(user)}/>
                            {(index+1) +'. '+user.name}
                            <button className="button icon" onClick={() => onDeleteClick(user)}>X</button>
                        </li>;
                    }
                        )}
                </FlipMove>
                <button className="button" onClick={onCopyClick}>Copier l'état</button>
            </div>
        </div>
    );
}

export default App;
