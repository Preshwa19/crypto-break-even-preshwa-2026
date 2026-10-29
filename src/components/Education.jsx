import { BookOpen } from 'lucide-react';

const TOPICS = [
  {
    q: 'What is a break-even price?',
    a: 'It is the selling price per coin at which your sale returns exactly the money you put in, including the fees you entered. At that price you end with neither a gain nor a loss in the model.',
  },
  {
    q: 'Why do buying fees increase my cost?',
    a: 'The buying fee is paid on top of the purchase amount, so your real investment is higher than coins × price. That larger total is what you need to recover.',
  },
  {
    q: 'Why do selling fees increase the price I need?',
    a: 'The selling fee is taken out of what you receive. To still end up with your full cost after that deduction, the gross sale has to be larger, so the break-even price rises above your cost per coin.',
  },
  {
    q: 'Why can selling at my purchase price lose money?',
    a: 'If you sell at exactly the price you paid, the buying and selling fees still apply. Net proceeds come out below your total cost, which is a small loss.',
  },
  {
    q: 'Does break-even mean the market will get there?',
    a: 'No. Knowing the price you need does not mean the market will reach it. Prices can move in either direction, and this calculator says nothing about whether or when that will happen.',
  },
];

export default function Education() {
  return (
    <section className="card learn-card no-print" aria-labelledby="learn-title">
      <h2 id="learn-title">
        <BookOpen size={18} aria-hidden="true" /> Understanding break-even
      </h2>
      <div className="faq">
        {TOPICS.map((t) => (
          <details key={t.q}>
            <summary>{t.q}</summary>
            <p>{t.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
