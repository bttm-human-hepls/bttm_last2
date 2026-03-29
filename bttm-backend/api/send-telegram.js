const axios = require('axios');

const BOT_TOKEN = "8618454476:AAF3jSxY4EueNABm25m21BMnfx-8LukRTq8";
const ADMIN_CHAT_ID = "6591281607";

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { transactionData, txId, userEmail } = req.body;
        
        if (!transactionData || !txId) {
            return res.status(400).json({ success: false, error: 'Missing fields' });
        }
        
        const amount = transactionData.amount || 0;
        const charge = amount >= 50 ? Math.max(5, Math.floor(amount / 1000) * 5) : 0;
        const date = new Date().toLocaleString('bn-BD');
        
        const message = `╔══════════════════════════════════╗
║     ⚡ B.T.T.M NEW TRANSACTION ⚡     ║
╚══════════════════════════════════════╝

🆔 **ID:** \`${txId}\`
📅 **Date:** ${date}
👤 **Sender:** ${transactionData.fullName}
📱 **Sender No:** ${transactionData.senderNumber}
💰 **Amount:** ৳${amount}
${charge > 0 ? `💸 **Service Charge:** ৳${charge}\n📊 **Net Amount:** ৳${amount - charge}` : ''}
📱 **Receiver:** ${transactionData.receiverNumber}
🔖 **TrxID:** ${transactionData.trxId}
📧 **User:** ${userEmail || 'N/A'}
📊 **Status:** ⏳ PENDING

────────────────────────────────────
✅ Approve | ❌ Reject | 📋 Details
────────────────────────────────────`;

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        
        res.json({ success: true, message: 'Notification sent' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};