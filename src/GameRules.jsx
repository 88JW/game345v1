const GameRules = () => {
  return (
    <div>
      <h2>Zasady gry</h2>
      <p>Połącz 3 lub więcej kwadratów tego samego koloru, aby usunąć je z planszy.</p>
      <p>Kliknij lub dotknij kwadrat, aby go wybrać, a następnie kliknij lub dotknij sąsiedni kwadrat, aby je zamienić.</p>
      <p>Jeśli zamiana spowoduje dopasowanie, kwadraty zostaną usunięte, a nowe kwadraty spadną na ich miejsce.</p>
      <p>Jeśli zamiana nie spowoduje dopasowania, kwadraty wrócą na swoje pierwotne miejsca.</p>
      <h3>Punktacja</h3>
      <p>Otrzymujesz 100 punktów za każdy kwadrat usunięty z planszy.</p>
    </div>
  );
};

export default GameRules;
