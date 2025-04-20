// State manager for storing and managing user choices
let userChoices = {
  action: "",
  parameters: {},
};

const stateManager = {
  // Set user choices
  setUserChoices: (choices: { action: string; parameters: any }) => {
    userChoices = choices;
  },

  // Get user choices
  getUserChoices: () => {
    return userChoices;
  },

  // Clear user choices
  clearUserChoices: () => {
    userChoices = {
      action: "",
      parameters: {},
    };
  },
};

export default stateManager;
