export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2023-01-01' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', createdAt: '2023-02-01' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'inactive', createdAt: '2023-03-01' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active', createdAt: '2023-04-01' },
    { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'active', createdAt: '2023-05-01' },
    { id: '6', name: 'Diana Prince', email: 'diana@example.com', role: 'Moderator', status: 'active', createdAt: '2023-06-01' },
    { id: '7', name: 'Eve Davis', email: 'eve@example.com', role: 'User', status: 'inactive', createdAt: '2023-07-01' },
    { id: '8', name: 'Frank Miller', email: 'frank@example.com', role: 'User', status: 'active', createdAt: '2023-08-01' },
    { id: '9', name: 'Grace Lee', email: 'grace@example.com', role: 'Admin', status: 'active', createdAt: '2023-09-01' },
    { id: '10', name: 'Henry Taylor', email: 'henry@example.com', role: 'Moderator', status: 'inactive', createdAt: '2023-10-01' },
    { id: '11', name: 'Ivy Chen', email: 'ivy@example.com', role: 'User', status: 'active', createdAt: '2023-11-01' },
    { id: '12', name: 'Jack White', email: 'jack@example.com', role: 'User', status: 'active', createdAt: '2023-12-01' },
    { id: '13', name: 'Karen Black', email: 'karen@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-01' },
    { id: '14', name: 'Leo Green', email: 'leo@example.com', role: 'Moderator', status: 'inactive', createdAt: '2024-02-01' },
    { id: '15', name: 'Mia Blue', email: 'mia@example.com', role: 'User', status: 'active', createdAt: '2024-03-01' },
    { id: '16', name: 'Noah Yellow', email: 'noah@example.com', role: 'User', status: 'active', createdAt: '2024-04-01' },
    { id: '17', name: 'Olivia Purple', email: 'olivia@example.com', role: 'Admin', status: 'active', createdAt: '2024-05-01' },
    { id: '18', name: 'Peter Red', email: 'peter@example.com', role: 'Moderator', status: 'inactive', createdAt: '2024-06-01' },
    { id: '19', name: 'Quinn Orange', email: 'quinn@example.com', role: 'User', status: 'active', createdAt: '2024-07-01' },
    { id: '20', name: 'Ryan Pink', email: 'ryan@example.com', role: 'User', status: 'active', createdAt: '2024-08-01' },
    { id: '21', name: 'Sara Violet', email: 'sara@example.com', role: 'Admin', status: 'active', createdAt: '2024-09-01' },
    { id: '22', name: 'Tom Indigo', email: 'tom@example.com', role: 'User', status: 'inactive', createdAt: '2024-10-01' }
];

export const UserService = {
    getUsers(): Promise<User[]> {
        return Promise.resolve(users);
    },

    createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        const newUser: User = {
            ...user,
            id: this.generateId(),
            createdAt: new Date().toISOString().split('T')[0]
        };
        users.push(newUser);
        return Promise.resolve(newUser);
    },

    updateUser(user: User): Promise<User> {
        const index = users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
            return Promise.resolve(user);
        } else {
            return Promise.reject(new Error('User not found'));
        }
    },
    deleteUser(id: string): Promise<void> {
        const index = users.findIndex((u) => u.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('User not found'));
        }
    },
    generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
};
