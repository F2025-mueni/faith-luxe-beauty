// ==========================================
// FAITH LUXE BEAUTY
// AUTH STATE CHECK
// ==========================================

import {
    getAuth,
    onAuthStateChanged,
    signOut
}
from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { app } from "./firebase-config.js";


// ==========================================
// INITIALIZE FIREBASE AUTH
// ==========================================

const auth = getAuth(app);


// ==========================================
// CHECK CURRENT USER
// ==========================================

onAuthStateChanged(
    auth,
    user => {

        const loginLinks =
            document.querySelectorAll(
                ".login-link"
            );

        const accountLinks =
            document.querySelectorAll(
                ".account-link"
            );

        const logoutButtons =
            document.querySelectorAll(
                ".logout-btn"
            );


        // ==================================
        // USER IS LOGGED IN
        // ==================================

        if (user) {

            console.log(
                "Faith Luxe Beauty user:",
                user.email
            );


            // Show account links

            accountLinks.forEach(
                link => {

                    link.style.display =
                        "inline-flex";

                }
            );


            // Hide login links

            loginLinks.forEach(
                link => {

                    link.style.display =
                        "none";

                }
            );


            // Add user's name if element exists

            const userName =
                document.getElementById(
                    "user-name"
                );


            if (userName) {

                userName.textContent =
                    user.displayName ||
                    user.email.split("@")[0];

            }


            // Add user's email if element exists

            const userEmail =
                document.getElementById(
                    "user-email"
                );


            if (userEmail) {

                userEmail.textContent =
                    user.email;

            }

        }


        // ==================================
        // USER IS NOT LOGGED IN
        // ==================================

        else {

            console.log(
                "No Faith Luxe Beauty user is logged in."
            );


            // Show login links

            loginLinks.forEach(
                link => {

                    link.style.display =
                        "inline-flex";

                }
            );


            // Hide account links

            accountLinks.forEach(
                link => {

                    link.style.display =
                        "none";

                }
            );

        }


        // ==================================
        // LOGOUT BUTTONS
        // ==================================

        logoutButtons.forEach(
            button => {

                button.onclick =
                    async () => {

                        try {

                            await signOut(auth);


                            alert(
                                "You have been logged out."
                            );


                            window.location.href =
                                "index.html";


                        } catch (error) {

                            console.error(
                                "Logout error:",
                                error
                            );


                            alert(
                                "Unable to logout. Please try again."
                            );

                        }

                    };

            }
        );

    }
);