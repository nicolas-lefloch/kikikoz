import {User} from './model/User';

export const pushList = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
}
// a function to get the list of users from local storage
export const getList = (): User[] => {
    let item = localStorage.getItem('users');
    if (item === null) {
        return [];
    }
    return JSON.parse(item) as User[];
}