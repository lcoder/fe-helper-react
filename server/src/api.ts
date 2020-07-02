import express from 'express';
import { getDirs } from './controllers/project';

const router = express.Router();

router.post('/dirs', getDirs);


export default router;