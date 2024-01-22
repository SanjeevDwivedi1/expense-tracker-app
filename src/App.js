import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const App = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState(null);

  const addIncome = () => {
    if (description && amount) {
      const newIncome = {
        id: `income-${new Date().getTime()}`,
        description,
        amount: parseFloat(amount),
      };

      setIncomes([...incomes, newIncome]);
      setDescription('');
      setAmount('');
    }
  };

  const addExpense = () => {
    if (description && amount) {
      const newExpense = {
        id: `expense-${new Date().getTime()}`,
        description,
        amount: parseFloat(amount),
      };

      setExpenses([...expenses, newExpense]);
      setDescription('');
      setAmount('');
    }
  };

  const deleteTransaction = (id, type) => {
    if (type === 'income') {
      setIncomes(incomes.filter((income) => income.id !== id));
    } else {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }

    // Reset editing state if the transaction being edited is deleted
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const editTransaction = (id, type) => {
    setEditingId(id);
    const transactions = type === 'income' ? incomes : expenses;
    const transactionToEdit = transactions.find((transaction) => transaction.id === id);
    setDescription(transactionToEdit.description);
    setAmount(transactionToEdit.amount.toString());
  };

  const saveTransaction = () => {
    if (editingId !== null) {
      if (description && amount) {
        const updatedTransactions = editingId.startsWith('income')
          ? incomes.map((income) =>
              income.id === editingId
                ? { ...income, description, amount: parseFloat(amount) }
                : income
            )
          : expenses.map((expense) =>
              expense.id === editingId
                ? { ...expense, description, amount: parseFloat(amount) }
                : expense
            );

        editingId.startsWith('income') ? setIncomes(updatedTransactions) : setExpenses(updatedTransactions);
        setEditingId(null);
        setDescription('');
        setAmount('');
      }
    }
  };

  const calculateTotal = (transactions) => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2);
  };

  const calculateRemainingBudget = () => {
    const totalIncome = calculateTotal(incomes);
    const totalExpense = calculateTotal(expenses);
    return (totalIncome - totalExpense).toFixed(2);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '40px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', color: '#333' }}>
        Budget Tracker
      </Typography>

      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={addIncome}
          style={{ marginTop: '10px', marginRight: '10px' }}
          startIcon={<SaveIcon />}
        >
          Add Income
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={addExpense}
          style={{ marginTop: '10px' }}
          startIcon={<SaveIcon />}
        >
          Add Expense
        </Button>

        {editingId !== null && (
          <Button
            variant="contained"
            color="primary"
            onClick={saveTransaction}
            style={{ marginTop: '10px', marginLeft: '10px' }}
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        )}
      </div>

      <div>
        <Typography variant="h6" gutterBottom style={{ color: '#333' }}>
          Incomes
        </Typography>

        <List>
          {incomes.map((income) => (
            <ListItem key={income.id} button style={{ borderBottom: '1px solid #ccc' }}>
              <ListItemText primary={`Income: $${income.amount.toFixed(2)}`} style={{ flex: '1' }} />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => editTransaction(income.id, 'income')}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteTransaction(income.id, 'income')}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom style={{ color: '#333' }}>
          Expenses
        </Typography>

        <List>
          {expenses.map((expense) => (
            <ListItem key={expense.id} button style={{ borderBottom: '1px solid #ccc' }}>
              <ListItemText primary={`Expense: $${expense.amount.toFixed(2)}`} style={{ flex: '1' }} />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => editTransaction(expense.id, 'expense')}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteTransaction(expense.id, 'expense')}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>

      <Typography variant="h6" style={{ marginTop: '20px', color: '#333' }}>
        Total Income: ${calculateTotal(incomes)}
      </Typography>
      <Typography variant="h6" style={{ color: '#333' }}>
        Total Expenses: ${calculateTotal(expenses)}
      </Typography>
      <Typography variant="h6" style={{ color: '#333' }}>
        Remaining Budget: ${calculateRemainingBudget()}
      </Typography>
    </Container>
  );
};

export default App;
