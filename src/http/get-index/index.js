const { google } = require('googleapis')
const { http } = require('@architect/functions')

async function authorized(req) {
  if (req.session.account) {
    let realCalories = 35
    let inboxCalories = req.session.account.data.messagesTotal
    let numberAte = Math.round(inboxCalories / realCalories)
    console.log(numberAte)
    console.log(typeof(inboxCalories))
    return {
      html: `
        <form action=/logout method=post>
          <button>logout</button>
        </form>

        <pre> If emails were calories, your inbox has eaten ${numberAte} Totino's Peperoni Pizza Rolls </pre>
      `
    }
  }
}

async function unauthorized(req) {
  if (req.path === '/') {
    let clientID = process.env.GOOGLE_CLIENT_ID
    let secret = process.env.GOOGLE_CLIENT_SECRET
    let redirect = process.env.GOOGLE_REDIRECT_URL
    let oAuth2Client = new google.auth.OAuth2(clientID, secret, redirect)
    let url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/gmail.readonly'
    })
    return {
      html: `<a href=${url}>Sign in with Google</a>`
    }
  }
  else {
    return http.proxy.public({spa: false})(req)
  }
}

exports.handler = http.async(authorized, unauthorized)
