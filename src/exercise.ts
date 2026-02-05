type Role = 'intern' | 'mentor' | 'admin';

export type User = {
    id: string;
    email: string;
    role: Role;
};

export type Result<T> = {ok: true; value: T} | {ok: false; error: string};

function validateUser(raw: unknown): Result<User> {
    if (!(raw && typeof raw === 'object')) {
        return {ok: false, error: 'Invalid JSON'};
    }

    const data = raw as Record<string, unknown>;
    let errorString = '';

    const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

    if (!('id' in data)) errorString += 'Missing field: id!';
    else if (!(typeof data.id === 'string'))
        errorString += 'Invalid id type (expected string)! ';
    if (!('email' in data)) errorString += 'Missing field: email! ';
    else if (!(typeof data.email === 'string'))
        errorString += 'Invalid email type (expected string)!';
    else if (!emailRegex.test(data.email))
        errorString += 'Invalid email format!';
    if (!('role' in data)) errorString += 'Missing field: role!';
    if (
        !(
            data.role === 'intern' ||
            data.role === 'mentor' ||
            data.role === 'admin'
        )
    )
        errorString +=
            'Invalid role type (expected "intern" | "mentor" | "admin")!';

    if (errorString !== '') {
        return {ok: false, error: errorString};
    }

    const user: User = {
        id: data.id as string,
        email: data.email as string,
        role: data.role as Role,
    };

    return {ok: true, value: user};
}

export function parseUserConfig(input: string): Result<User> {
    const parsed = JSON.parse(input);
    return validateUser(parsed);
}

export function parseUsersConfig(input: string): Result<User[]> {
    const parsed = JSON.parse(input);

    if (!(parsed && typeof parsed === 'object')) {
        return {ok: false, error: 'Invalid JSON'};
    }

    if (!Array.isArray(parsed)) {
        return {ok: false, error: 'Invalid data type (expected array)'};
    }

    let usersArray: User[] = [];

    for (let element of parsed) {
        let result = validateUser(element);

        if (!result.ok) {
            return {ok: false, error: 'Invalid User shape'};
        }
        usersArray.push(result.value);
    }

    return {ok: true, value: usersArray};
}

const inputs = [
    `{"id":"u1","email":"a@b.com","role":"intern"}`, //valid
    `{"id":"u2","email":"a@b.com","role":"boss"}`, //role type error
    `{"id":123,"email":"ab.com","role":"intern"}`, //id, email format error
];

const invalidJSONArray = `[{"id":"u1","email":"a@b.com","role":"intern"},
    {"id":"u2","email":"a@b.com","role":"boss"},
    {"id":123,"email":"a@b.com","role":"intern"}]`;

const validJSONArray = `
[{"id":"u1","email":"a@b.com","role":"intern"},
{"id":"u2","email":"a@b.com","role":"admin"},
{"id":"u3","email":"a@b.com","role":"mentor"}]`;

console.log('Inputs 0: ', parseUserConfig(inputs[0]));
console.log('Inputs 1: ', parseUserConfig(inputs[1]));
console.log('Inputs 2: ', parseUserConfig(inputs[2]));

console.log(
    'Invalid JSON array response: ',
    parseUsersConfig(invalidJSONArray),
);
console.log('Valid JSON array response: ', parseUsersConfig(validJSONArray));
