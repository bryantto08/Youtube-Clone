"use client";

import Image from "next/image"
import Link from "next/link"
import styles from "./navbar.module.css"
import SignIn from "./sign-in"
import Upload from "./upload";
import { onAuthStateChangedHelper } from "../firebase/firebase"
import { useState, useEffect} from "react"
import { User } from 'firebase/auth';

export default function Navbar() {
    // Init User State
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user)=>{
            setUser(user);
        });

        // cleanup subscription on unmount
        return () => unsubscribe();
    });
    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image src='/youtube-logo.svg' alt="YouTube Logo" width={90} height={20} />
            </Link>
            {
                user && <Upload />
            }
            <SignIn user={user}/>
        </nav>
    )
}