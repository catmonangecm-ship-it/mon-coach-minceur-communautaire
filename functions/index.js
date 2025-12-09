const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// Notification Telegram sécurisée
exports.notifierNouveauProduit = functions.firestore
    .document('produitsPartages/{productId}')
    .onCreate(async (snap, context) => {
        const produit = snap.data();
        const BOT_TOKEN = functions.config().telegram.token;
        const CHAT_ID = functions.config().telegram.chatid;
        
        const message = `
🆕 Nouveau produit partagé !

📦 ${produit.nom}
🔢 Code-barres: ${produit.codeBarres}
🔥 Calories: ${produit.calories} kcal
👤 Par: ${produit.auteurNom}
        `;
        
        try {
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: message
            });
            console.log('Notification envoyée');
        } catch (error) {
            console.error('Erreur Telegram:', error);
        }
    });

// Nettoyage quotidien des vieux défis
exports.resetDefisQuotidiens = functions.pubsub
    .schedule('0 0 * * *')
    .timeZone('Europe/Paris')
    .onRun(async (context) => {
        console.log('Reset défis quotidiens');
        return null;
    });
