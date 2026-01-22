const prisma = require('../lib/db');

exports.createGoal = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.body.user } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.body.user,
        name: req.body.name,
        amount: parseFloat(req.body.amount),
        saved: parseFloat(req.body.saved) || 0,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      }
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createUserGoal = async (req, res) => {
  try {
    const { email, name, amount, saved, description, startDate, endDate } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        name,
        amount: parseFloat(amount),
        saved: parseFloat(saved) || 0,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }
    });

    res.status(201).json({ message: 'Goal created successfully!', goal });
  } catch (error) {
    console.error('Error creating goal:', error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.getGoalsByUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    const goals = await prisma.goal.findMany({ where: { userId } });
    res.status(200).json(goals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGoalsByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const goals = await prisma.goal.findMany({ where: { userId: user.id } });
    res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.updateGoalSaved = async (req, res) => {
  try {
    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found.' });
    }

    const { saved } = req.body;
    const newSaved = goal.saved + (saved || 0);
    const goalAccomplished = newSaved >= goal.amount;

    const updatedGoal = await prisma.goal.update({
      where: { id: req.params.id },
      data: {
        saved: newSaved,
        goalAccomplished
      }
    });

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    await prisma.goal.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Goal deleted successfully!" });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Goal not found." });
    }
    res.status(500).json({ error: "Failed to delete the goal." });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { saved, amount } = req.body;
    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found.' });
    }

    const newSaved = saved !== undefined ? parseFloat(saved) : goal.saved;
    const newAmount = amount !== undefined ? parseFloat(amount) : goal.amount;
    const goalAccomplished = newSaved >= newAmount;

    const updatedGoal = await prisma.goal.update({
      where: { id: req.params.id },
      data: {
        saved: newSaved,
        amount: newAmount,
        goalAccomplished
      }
    });

    res.status(200).json({ message: 'Goal updated successfully!', goal: updatedGoal });
  } catch (error) {
    console.error('Error updating goal:', error.message);
    res.status(400).json({ error: error.message });
  }
};
