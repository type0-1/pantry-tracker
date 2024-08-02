'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Paper } from '@mui/material';
import { collection, getDocs, query, setDoc, getDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });

    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item) => {
    if (!item) {
      console.error('Invalid item:', item);
      return;
    }

    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const addItem = async (item, quantity) => {
    if (!item) {
      console.error('Invalid item:', item);
      return;
    }

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: parseInt(quantity) });
    } else {
      await setDoc(docRef, { quantity: parseInt(quantity) });
    }
    await updateInventory();
  };

  const handleOpen = (item = '', quantity = 1) => {
    setCurrentItem(item);
    setItemName(item);
    setItemQuantity(quantity);
    setIsUpdate(!!item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setItemQuantity(1);
    setIsUpdate(false);
    setCurrentItem('');
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
      p={3}
      sx={{ backgroundColor: '#f0f4f7' }}
    >
      <Typography variant="h3" color="primary" mb={2}>
        Pantry Inventory
      </Typography>
      <Stack direction="row" spacing={2} mb={2} width="100%" maxWidth="800px">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search for an item"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Item
        </Button>
      </Stack>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: '800px', p: 3 }}>
        <Stack spacing={2}>
          {filteredInventory.length === 0 ? (
            <Typography variant="h6" color="textSecondary" align="center">
              No items found.
            </Typography>
          ) : (
            filteredInventory.map(({ name, quantity }) => (
              <Paper key={name} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Typography variant="h6">{quantity}</Typography>
                <Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpen(name, quantity)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => removeItem(name)}
                  >
                    Delete
                  </Button>
                </Box>
              </Paper>
            ))
          )}
        </Stack>
      </Paper>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", borderRadius: 1, boxShadow: 24, p: 4 }}
        >
          <Typography variant="h6" color="textPrimary" mb={2}>
            {isUpdate ? 'Update Item' : 'Add Item'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant='outlined'
              fullWidth
              type="number"
              label="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <Button
              variant='contained'
              color="primary"
              onClick={() => {
                addItem(itemName, itemQuantity);
                handleClose();
              }}
            >
              {isUpdate ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}
