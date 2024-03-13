import React, { useState } from 'react';

function useStack() {
  const [stack, setStack] = useState([]);

  const pushToStack = (item) => {
    setStack([...stack, item]);
  };

  const popFromStack = () => {
    if (stack.length === 0) {
      console.error('Stack is empty');
      return null;
    }
    const updatedStack = [...stack];
    const poppedItem = updatedStack.pop();
    setStack(updatedStack);
    return poppedItem;
  };

  const peekStack = () => {
    if (stack.length === 0) {
      console.error('Stack is empty');
      return null;
    }
    return stack[stack.length - 1];
  };

  const isEmpty = () => {
    return stack.length === 0;
  };

  const clearStack = () => {
    setStack([]);
  };

  return {
    pushToStack,
    popFromStack,
    peekStack,
    isEmpty,
    clearStack,
  };
}

export default useStack;
