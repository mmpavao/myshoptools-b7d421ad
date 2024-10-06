import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import OpenAI from 'openai';

// Configuração do Firebase
const firebaseConfig = {
  // Adicione sua configuração do Firebase aqui
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const APIMarketplaceFirebase = () => {
  const navigate = useNavigate();
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bots, setBots] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchApiKey();
        fetchBots();
      }
    });

    return () => unsubscribe();
  }, []);

  const apiList = [
    {
      name: "OpenAI GPT-4",
      description: "Integrate advanced AI language models into your application.",
      category: "Artificial Intelligence",
      price: "$0.03 per 1K tokens",
      route: "/api-integration/openai"
    },
    // Add other API items here
  ];

  const fetchApiKey = async () => {
    if (!user) return;

    try {
      const userSettingsRef = collection(db, 'user_settings');
      const q = query(userSettingsRef, where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const settingsData = querySnapshot.docs[0].data();
        setOpenaiApiKey(settingsData.openai_api_key || '');
      }
    } catch (error) {
      console.error('Erro ao buscar chave da API:', error);
      toast.error('Falha ao carregar a chave da API');
    }
  };

  const fetchBots = async () => {
    if (!user) return;

    try {
      const botsRef = collection(db, 'bots');
      const q = query(botsRef, where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const botsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBots(botsList);
    } catch (error) {
      console.error('Erro ao buscar bots:', error);
      toast.error('Falha ao carregar a lista de bots');
    }
  };

  const handleSaveApiKey = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userSettingsRef = collection(db, 'user_settings');
      const q = query(userSettingsRef, where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(userSettingsRef, { user_id: user.uid, openai_api_key: openaiApiKey });
      } else {
        const settingsDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'user_settings', settingsDoc.id), { openai_api_key: openaiApiKey });
      }

      const openai = new OpenAI({ apiKey: openaiApiKey });
      await openai.chat.completions.create({ messages: [{ role: 'user', content: 'Test' }], model: 'gpt-3.5-turbo' });

      toast.success('Chave da API salva e testada com sucesso');
      fetchBots();
    } catch (error) {
      console.error('Erro ao salvar ou testar chave da API:', error);
      toast.error('Falha ao salvar ou testar chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBot = async (name, description) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const openai = new OpenAI({ apiKey: openaiApiKey });
      const assistant = await openai.beta.assistants.create({
        name: name,
        instructions: description,
        model: 'gpt-3.5-turbo',
      });

      await addDoc(collection(db, 'bots'), {
        user_id: user.uid,
        name: name,
        description: description,
        openai_assistant_id: assistant.id,
      });

      toast.success('Bot criado com sucesso!');
      fetchBots();
    } catch (error) {
      console.error('Erro ao criar bot:', error);
      toast.error('Falha ao criar bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegrate = (api) => {
    if (api.route) {
      navigate(api.route);
    } else {
      console.log(`Integration for ${api.name} is not implemented yet.`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Marketplace</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>OpenAI Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            placeholder="OpenAI API Key"
            className="mb-2"
          />
          <Button onClick={handleSaveApiKey} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save and Test API Key'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiList.map((api, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{api.name}</CardTitle>
              <CardDescription>{api.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{api.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm font-semibold">{api.price}</span>
              <Button onClick={() => handleIntegrate(api)}>Integrate</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default APIMarketplaceFirebase;
