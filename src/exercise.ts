type Role = 'intern' | 'mentor' | 'admin';

export type User = {
    id: string;
    email: string;
    role: Role;
};

export type Result<T> = {ok: true; value: T} | {ok: false; error: string};

export function parseUserConfig(input: string): Result<User> {
    const parsed = JSON.parse(input);
    if (!(parsed && typeof parsed === 'object')) {
        return {ok: false, error: 'Invalid JSON'};
    }
    let errorString = '';

    const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

    if (!('id' in parsed)) errorString += 'Missing field: id!';
    if (!(typeof parsed.id === 'string'))
        errorString += 'Invalid id type (expected string)!';
    if (!('email' in parsed)) errorString += 'Missing field: email! ';
    if (!(typeof parsed.email === 'string'))
        errorString += 'Invalid email type (expected string)!';
    if (!emailRegex.test(parsed.email)) errorString += 'Invalid email format!';
    if (!('role' in parsed)) errorString += 'Missing field: role!';
    if (
        !(
            parsed.role === 'intern' ||
            parsed.role === 'mentor' ||
            parsed.role === 'admin'
        )
    )
        errorString +=
            'Invalid role type (expected "intern" | "mentor" | "admin")!';

    if (errorString !== '') {
        return {ok: false, error: errorString};
    }

    return {ok: true, value: parsed};
}

const inputs = [
    `{"id":"u1","email":"a@b.com","role":"intern"}`,
    `{"id":"u2","email":"a@b.com","role":"boss"}`,
    `{"id":123,"email":"ab.com","role":"intern"}`,
];

const invalidJSONArray = `[{"id":"u1","email":"a@b.com","role":"intern"},
    {"id":"u2","email":"a@b.com","role":"boss"},
    {"id":123,"email":"a@b.com","role":"intern"}]`;

const validJSONArray = `
[{"id":"u1","email":"a@b.com","role":"intern"},
{"id":"u2","email":"a@b.com","role":"admin"},
{"id":"u3","email":"a@b.com","role":"mentor"}]`;

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
        let result = parseUserConfig(JSON.stringify(element));

        if (!result.ok) {
            return {ok: false, error: 'Invalid User shape'};
        }
        usersArray.push(result.value);
    }

    return {ok: true, value: usersArray};
}

console.log('Inputs 0: ', parseUserConfig(inputs[0]));
console.log('Inputs 1: ', parseUserConfig(inputs[1]));
console.log('Inputs 2: ', parseUserConfig(inputs[2]));

console.log(
    'Invalid JSON array response: ',
    parseUsersConfig(invalidJSONArray),
);
console.log('Valid JSON array response: ', parseUsersConfig(validJSONArray));
