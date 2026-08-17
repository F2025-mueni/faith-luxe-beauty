// ==========================================
// FAITH LUXE BEAUTY
// FIREBASE AUTHENTICATION
// ==========================================

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    updateProfile,
    signOut,
    onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { app } from "./firebase-config.js";


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider =
    new GoogleAuthProvider();


// ==========================================
// ELEMENTS
// ==========================================

const loginForm =
    document.getElementById("login-form");

const registerForm =
    document.getElementById("register-form");

const googleLogin =
    document.getElementById("google-login");

const googleRegister =
    document.getElementById("google-register");

const forgotPassword =
    document.getElementById("forgot-password");


// ==========================================
// HELPER: SHOW MESSAGE
// ==========================================

function showMessage(
    elementId,
    message,
    type = "error"
) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className =
        `auth-message ${type}`;

}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "login-email"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "login-password"
                    )
                    .value;


            if (!email || !password) {

                showMessage(
                    "login-message",
                    "Please enter your email and password."
                );

                return;
            }


            try {

                showMessage(
                    "login-message",
                    "Signing you in...",
                    "success"
                );


                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                showMessage(
                    "login-message",
                    "Login successful. Redirecting...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "index.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                let message =
                    "Unable to login. Please try again.";


                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    message =
                        "Incorrect email or password.";

                }

                else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    message =
                        "No account was found with this email.";

                }

                else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    message =
                        "Incorrect password.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Please enter a valid email address.";

                }


                showMessage(
                    "login-message",
                    message,
                    "error"
                );

            }

        }
    );

}



// ==========================================
// REGISTER
// ==========================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const firstName =
                document
                    .getElementById(
                        "register-first-name"
                    )
                    .value
                    .trim();


            const lastName =
                document
                    .getElementById(
                        "register-last-name"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "register-email"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "register-phone"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "register-password"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirm-password"
                    )
                    .value;


            // --------------------------
            // VALIDATION
            // --------------------------

            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "register-message",
                    "Passwords do not match."
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "register-message",
                    "Password must be at least 6 characters."
                );

                return;

            }


            try {

                showMessage(
                    "register-message",
                    "Creating your account...",
                    "success"
                );


                // --------------------------
                // CREATE FIREBASE ACCOUNT
                // --------------------------

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                // --------------------------
                // UPDATE USER PROFILE
                // --------------------------

                await updateProfile(
                    user,
                    {
                        displayName:
                            `${firstName} ${lastName}`
                    }
                );


                // --------------------------
                // SAVE CUSTOMER
                // --------------------------

                await setDoc(
                    doc(
                        db,
                        "customers",
                        user.uid
                    ),
                    {

                        uid:
                            user.uid,

                        firstName:
                            firstName,

                        lastName:
                            lastName,

                        fullName:
                            `${firstName} ${lastName}`,

                        email:
                            email,

                        phone:
                            phone,

                        createdAt:
                            serverTimestamp(),

                        role:
                            "customer"

                    }
                );


                showMessage(
                    "register-message",
                    "Account created successfully!",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "index.html";

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                let message =
                    "Unable to create your account.";


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message =
                        "An account already exists with this email.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Please enter a valid email address.";

                }

                else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message =
                        "Your password is too weak.";

                }


                showMessage(
                    "register-message",
                    message,
                    "error"
                );

            }

        }
    );

}



// ==========================================
// GOOGLE LOGIN
// ==========================================

async function loginWithGoogle(
    messageElement
) {

    try {

        showMessage(
            messageElement,
            "Connecting to Google...",
            "success"
        );


        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        const user =
            result.user;


        // --------------------------
        // SAVE / UPDATE CUSTOMER
        // --------------------------

        await setDoc(
            doc(
                db,
                "customers",
                user.uid
            ),
            {

                uid:
                    user.uid,

                fullName:
                    user.displayName || "",

                email:
                    user.email || "",

                phone:
                    user.phoneNumber || "",

                photoURL:
                    user.photoURL || "",

                lastLogin:
                    serverTimestamp(),

                role:
                    "customer"

            },
            {
                merge: true
            }
        );


        window.location.href =
            "index.html";


    } catch (error) {

        console.error(
            "Google login error:",
            error
        );


        showMessage(
            messageElement,
            "Google login was cancelled or failed.",
            "error"
        );

    }

}



// ==========================================
// GOOGLE LOGIN BUTTON
// ==========================================

if (googleLogin) {

    googleLogin.addEventListener(
        "click",
        () => {

            loginWithGoogle(
                "login-message"
            );

        }
    );

}


if (googleRegister) {

    googleRegister.addEventListener(
        "click",
        () => {

            loginWithGoogle(
                "register-message"
            );

        }
    );

}



// ==========================================
// FORGOT PASSWORD
// ==========================================

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "login-email"
                    )
                    .value
                    .trim();


            if (!email) {

                showMessage(
                    "login-message",
                    "Enter your email address first."
                );

                return;

            }


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                showMessage(
                    "login-message",
                    "Password reset email sent. Check your inbox.",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Password reset error:",
                    error
                );


                showMessage(
                    "login-message",
                    "Unable to send the password reset email.",
                    "error"
                );

            }

        }
    );

}



// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(
    auth,
    user => {

        if (user) {

            console.log(
                "Logged in:",
                user.email
            );

        } else {

            console.log(
                "No user is logged in."
            );

        }

    }
);



// ==========================================
// LOGOUT FUNCTION
// ==========================================

export async function logoutUser() {

    try {

        await signOut(auth);

        window.location.href =
            "index.html";

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


// ==========================================
// EXPORT AUTH
// ==========================================

export {
    auth
};