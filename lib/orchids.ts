// Local Mock for Orchids Database with Auth support

class DocumentSnapshot {
    constructor(public id: string, private _data: any, public exists: boolean = true) { }
    data() { return this._data; }
}

class CollectionSnapshot {
    constructor(public docs: DocumentSnapshot[]) { }
    get empty() { return this.docs.length === 0; }
}

class Query {
    constructor(protected collectionName: string, protected dataStore: any) { }

    where(field: string, op: string, value: any) {
        // Basic filter mock
        return this;
    }

    orderBy(field: string, direction: string = 'asc') {
        return this;
    }

    async get() {
        const items = this.dataStore[this.collectionName] || {};
        const docs = Object.keys(items).map(id => new DocumentSnapshot(id, items[id]));
        return new CollectionSnapshot(docs);
    }

    async add(data: any) {
        const id = Math.random().toString(36).substr(2, 9);
        if (!this.dataStore[this.collectionName]) this.dataStore[this.collectionName] = {};
        this.dataStore[this.collectionName][id] = data;
        return { id };
    }
}

class DocumentReference {
    constructor(private collectionName: string, private id: string, private dataStore: any) { }

    async get() {
        const data = (this.dataStore[this.collectionName] || {})[this.id];
        return new DocumentSnapshot(this.id, data, !!data);
    }

    async update(data: any) {
        if (!this.dataStore[this.collectionName]) this.dataStore[this.collectionName] = {};
        this.dataStore[this.collectionName][this.id] = {
            ...(this.dataStore[this.collectionName][this.id] || {}),
            ...data
        };
        return { success: true };
    }

    async set(data: any) {
        if (!this.dataStore[this.collectionName]) this.dataStore[this.collectionName] = {};
        this.dataStore[this.collectionName][this.id] = data;
        return { success: true };
    }
}

class CollectionReference extends Query {
    doc(id: string) {
        return new DocumentReference(this.collectionName, id, this.dataStore);
    }
}

class Db {
    constructor(private dataStore: any) { }
    collection(name: string) {
        return new CollectionReference(name, this.dataStore);
    }
}

class Auth {
    constructor(private dataStore: any) { }
    async signInWithEmail(email: string, pass: string) {
        // Simple mock login: any email works, but let's check our 'users' collection
        const users = this.dataStore['users'] || {};
        const userEntry = Object.entries(users).find(([id, u]: [string, any]) => u.email === email);

        if (userEntry) {
            return { user: { id: userEntry[0], email: (userEntry[1] as any).email } };
        }

        // If user doesn't exist, create a temporary one for easy testing
        const id = 'test-user-id';
        const newUser = { id, email, full_name: 'Test Kullanıcı', role: 'patient' };
        if (!this.dataStore['users']) this.dataStore['users'] = {};
        this.dataStore['users'][id] = newUser;
        return { user: { id, email } };
    }
    async signUpWithEmail(email: string, pass: string) {
        const id = Math.random().toString(36).substr(2, 9);
        return { user: { id, email } };
    }
    async signOut() {
        return { success: true };
    }
}

// In-memory data store for the session
const globalDataStore: any = {
    users: {
        'admin-1': {
            id: 'admin-1',
            email: 'admin@test.com',
            full_name: 'Sistem Yöneticisi',
            role: 'admin',
            phone: '5550001122',
            created_at: new Date().toISOString()
        },
        'patient-1': {
            id: 'patient-1',
            email: 'hasta@test.com',
            full_name: 'Ahmet Yılmaz',
            role: 'patient',
            phone: '5551112233',
            created_at: new Date().toISOString()
        }
    }
};

export class Orchids {
    public db: Db;
    public auth: Auth;
    constructor(config: any) {
        this.db = new Db(globalDataStore);
        this.auth = new Auth(globalDataStore);
    }
}

export const COLLECTIONS = {
    USERS: 'users',
    INFO_PAGES: 'info_pages',
    SYMPTOMS: 'symptoms',
    SYMPTOM_RECORDS: 'symptom_records',
    RECOMMENDATIONS: 'recommendations',
    QUESTIONS: 'questions',
    EXPERIENCES: 'experiences',
    BLOOD_TESTS: 'blood_tests',
    APPOINTMENTS: 'appointments',
};

export const orchids = new Orchids({
    projectId: 'mock',
    apiKey: 'mock',
});
