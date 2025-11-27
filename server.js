
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// test route
app.get('/api/status', (req,res)=>res.json({ok:true}));

app.post('/api/checkout', async (req,res)=>{
  const {amount} = req.body;
  const session = await stripe.checkout.sessions.create({
    mode:'payment',
    line_items:[{price_data:{currency:'usd',product_data:{name:'VF Item'},unit_amount:amount},quantity:1}],
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL
  });
  res.json({url:session.url});
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log('server running'));
