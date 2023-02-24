import React, {useEffect, useState} from 'react';
import FlipMove from 'react-flip-move';
import {useLocation, useNavigate} from 'react-router-dom';
import {getList, pushList} from '../data-service';
import {User} from '../model/User';
import {colors} from '../model/Colors';

export default function Main() {

    const location = useLocation();
    const [userList, setUserList] = useState<User[]>([]);
    const [message, setMessage] = useState('');
    const [firstLoad, setFirstLoad] = useState(true);
    const navigate = useNavigate();

    const getPath = (users: User[]) => {
        return '/' + users
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((user) => user.name+(user.type ? ':'+(user.type+1) : ''))
            .join('/');
    }

    useEffect(() => {
        if(firstLoad) {
            let users = location.pathname.split('/')
                .filter(part => part)
                .map(part => part.split(':'))
                .map(part =>  ({name: part[0], uid: Math.random(), type: part[1] ? (Number(part[1]) -1) : 0} as User));
            if(users.length === 0) {
                users = getList();
            }
            let path = getPath(users);
            if(path !== location.pathname) {
                navigate(path);
            }
            setUserList([...shuffle(users)]);
            pushList(users);

            setFirstLoad(false);
        }
    }, [location]);

    const onAddClick = () => {
        if (!message) {
            return;
        }
        userList.push({name: message, type: 0, uid: Math.random()} as User);
        navigate(getPath(userList));
        setMessage('');
    };

    const onCopyClick = () => {
        const text = userList
            .filter((user) => !user.dayOff)
            .map((user, index) => {
                return (index+1) + '. '+user.name;
            }).join('\n');
        // Copy to clipboard
        navigator.clipboard.writeText(text);
    };
    const onDeleteClick = (user : User) => {
        let users = userList.filter((u) => u !== user);
        setUserList([...users]);
        pushList(users);
        navigate(getPath([...users]));
    };

    const onCategoryClick = (user : User) => {
        user.type++;
        if(user.type >= colors.length) {
            user.type = 0;
        }
        setUserList([...userList]);
        pushList(userList);
        navigate(getPath(userList));
    };

    const onRandomClick = () => {
        setUserList([...shuffle(userList)]);
        pushList(userList);
    };

    function sortList(list : User[]) {
        return list.sort((a, b) => a.type - b.type)
            .sort((a, b) => a.dayOff ? 1 : -1);
    }

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

        let offUsers = array.filter((user) => user.dayOff);

        let users = array.sort((a, b) => a.type - b.type)
            .filter((user) => !user.dayOff);
        offUsers.forEach((user) => users.push(user));
        return users;
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

    const createTeam = (teamString: string | null) => {
        if(teamString) {
            const team = teamString.split('/');
        }
    }

    function onDayOffClick(user: User) {
        user.dayOff = !user.dayOff;
        if (user.dayOff) {
            let list = userList.filter((u) => u.uid !== user.uid);
            list.push(user);
            setUserList([...list]);
        } else {
            setUserList([...sortList(userList)]);

        }
    }

    return (
        <div className="app">
            <div className="container">
            <header className="header card">
                <h1>Kikoz</h1>
                <div className="colors">
                    {
                        userList.map(o => o.type)
                            //unique
                            .filter((value, index, self) => self.indexOf(value) === index)
                            .sort((a, b) => a - b)
                            .map((type) => colors[type])
                            .map((color) => <div className="user-type" style={{backgroundColor: color}}></div>)
                    }
                </div>
            </header>
                <div className="add-form">
                    <input className="input"  type="text" value={message} onKeyUp={handleKeyDown} onChange={handleChange}/>
                    <button className={`button ${message ? '' : 'disabled'}`} onClick={onAddClick}>Ajouter</button>
                </div>
            </div>
                <div className="content">
                { userList.length > 1 &&  <button className="button" onClick={onRandomClick}>Lancer la génération 🔀</button>}
                <FlipMove typeName="ol">
                    {userList.map((user, index) =>
                        {
                            return  <li className={`card user`+ (user.dayOff ? ' off' : '')} key={user.uid} >
                                <div className="user-type" style={{backgroundColor: colors[user.type]}} onClick={() => onCategoryClick(user)}/>
                                <span onClick={() => onDayOffClick(user)}>{(!user.dayOff ? (index+1) +'. ' : '') +user.name}</span>
                                <button className="button icon" onClick={() => onDeleteClick(user)}>X</button>
                            </li>;
                        }
                    )}
                </FlipMove>
                { userList.length > 1 && <button className="button" onClick={onCopyClick}>Copier l'état</button> }

            </div>
        </div>
    );
}