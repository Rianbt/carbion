import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 3001;

//config cors
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

//JSON config
app.use(express.json());

//Models 

import User from './models/User.js';

//open route - public route
app.get('/', (req, res) => {
  res.status(200).json({msg: 'bem vindo ao carbion'});
});

// private route - precisa de token
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({msg: 'ID inválido'});
    }

    const user = await User.findById(id).select('-password -__v');
    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'});
    }
    res.status(200).json({user});
});

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return res.status(401).json({msg: 'Acesso negado'});
    } 

    try {
        const secret = process.env.SECRET;

        const decoded = jwt.verify(token, secret);
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({msg: 'Token inválido'});
    }
}

//login route
app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({msg: 'Todos os campos são obrigatórios'});
    }

    // checar se usuario existe
    const user = await User 
        .findOne({email: email})
        .select('-__v');

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'});
    }

    // checar se a senha esta correta
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(422).json({msg: 'Senha inválida'});
    }

    // criar token

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        );
        res.status(200).json({msg: 'Login realizado com sucesso', token});
    } catch (error) {
        res.status(500).json({msg: 'Erro ao gerar token'});
    }
});


// registrar usuario
app.post('/auth/register', async (req, res) => {

    const {name, email, password, confirmpassword} = req.body;  

    //validações
    if(!name || !email || !password || !confirmpassword) {
        return res.status(400).json({msg: 'Todos os campos são obrigatórios'});
    }

    // validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return res.status(400).json({msg: 'E-mail inválido'});
    }

    if(password !== confirmpassword) {
        return res.status(400).json({msg: 'As senhas não conferem'});
    }

    // check if user exists
    const userExists = await User.findOne({email: email});
    if(userExists) {
        return res.status(400).json({msg: 'Por favor, utilize outro e-mail'});
    };

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);


    // create user
    const user = new User({
        name,
        email,
        password: passwordHash
    });

    try {
        await user.save();
        res.status(201).json({msg: 'Usuário registrado com sucesso'});
    } catch (error) {
        res.status(500).json({msg: 'Erro ao registrar usuário', error: error.message});
    }
});

//credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.j6zsxa5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});