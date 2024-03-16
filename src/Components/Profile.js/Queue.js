import React, { useState } from 'react';

function useQueue() {
  const [queue, setQueue] = useState([]);

  const enqueue = (item) => {
    setQueue([...queue, item]);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      console.error('Queue is empty');
      return null;
    }
    const updatedQueue = [...queue];
    const dequeuedItem = updatedQueue.shift();
    setQueue(updatedQueue);
    return dequeuedItem;
  };

  const peek = () => {
    if (queue.length === 0) {
      console.error('Queue is empty');
      return null;
    }
    return queue[0];
  };

  const isEmpty = () => {
    return queue.length === 0;
  };

  const clear = () => {
    setQueue([]);
  };

  return {
    enqueue,
    dequeue,
    peek,
    isEmpty,
    clear,
  };
}

export default useQueue;
