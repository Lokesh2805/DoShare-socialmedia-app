import { createContext, useContext, useEffect, useState } from "react";
import { superbase } from "../superbase-client";
import { User } from "@supabase/supabase-js";
interface AuthContextType {
    user: User | null;
    signInWithGithub: ()=> void;
    signOut: ()=> void;
} 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) =>{
    const [user, setUser] = useState<User | null>(null);

    useEffect(()=>{
        superbase.auth.getSession().then(({data: {session}})=>{
            setUser(session?.user ?? null);
        })
         const {data: listener} = superbase.auth.onAuthStateChange((_, session)=>{
            setUser(session?.user ?? null);
         })

         return ()=>{
            listener.subscription.unsubscribe();
         }
    }, [])

    const signInWithGithub = () =>{
        superbase.auth.signInWithOAuth({provider: "github"})
    };


    const signOut = () =>{
        superbase.auth.signOut()
    };

    return <AuthContext.Provider value={{user, signInWithGithub, signOut}}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType =>{
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}