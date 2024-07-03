export interface event {
	id: string;
    name: string,
    theme: string,
    about: string,
    image: string,
    date: string,
    rulebook: {
        structure: string[],
        rules: string[],
        judging: string[],
        prizes: string[]
    },
    organisers: person[]
}

export interface workshop {
    name: string,
    about: string,
    speakers: string[],
    date: string,
    fees: number,
    topics: string[],
    regdate: string,
    location: string,
    prereq: string[],
    image: string,
    id: string
}

export interface person{
    name: string,
    image: string,
    phone: number
}

export interface payment{
    userID: string,
    eventID: string,
    amount: number,
    transactionID: string,
    CAcode: number | null
}


export interface RegisterData{
    eventID: string,
    registeredEmails: string[]
}

export type MerchItem = {
    name: string,
    price: number
    size: string
}

export type informal = {
    name: string,
    about: string,
    location: string,
    date: string,
    image: string,
    registerLink: string | null
}

// dummy data type by Hemant Pathak, to be done by Geeteshwar

export type data = {
    title: string,
    links: {
        url: string,
        linkText: string,
        linkIcon: string
    }[],
    btpIcon: string
}