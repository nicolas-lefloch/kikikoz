import React, {useState} from 'react';
import './App.scss';
import {User} from './model/User';
import FlipMove from 'react-flip-move';

function App() {
    const [userList, setUserList] = useState([] as User[]);
    const [message, setMessage] = useState('');
    const onAddClick = () => {
        userList.push({name: message, type: '', uid: Math.random()});
        setUserList([...userList]);
        setMessage('');
    };
    const onDeleteClick = (user : User) => {
        setUserList([...userList.filter((u) => u !== user)]);
    };
    const onRandomClick = () => {

        shuffle(userList);

        setUserList([...userList]);
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


    return (
        <div className="app">
            <header className="header card">
                Kikoz
            </header>
            <div className="content">
                <div className="add-form">
                    <input className="input" type="text" value={message} onKeyUp={handleKeyDown} onChange={handleChange}/>
                    <button className="button" onClick={onAddClick}>Ajouter</button>
                </div>
                <button className="button" onClick={onRandomClick}>Lancer la génération</button>
                    <FlipMove typeName="ol">
                    {userList.map((user) => {
                        return <li key={user.uid+''} className="card user">{user.name}
                            <button className="button" onClick={() => onDeleteClick(user)}>Supprimer</button>
                        </li>
                    })
                    }
                    </FlipMove>
            </div>
        </div>
    );
}

export default App;
