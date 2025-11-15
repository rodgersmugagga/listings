import { useEffect, useState } from 'react';

export default function Contact({ listing }) {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchOwner = async () => {
      const userId = listing?.userRef;
      

      if (!userId) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}`);
        const data = await res.json();
        setOwner(data);
      } catch (err) {
        console.error("Owner fetch error:", err.message);
      }
    };

    fetchOwner();
  }, [listing]);

  if (!owner) return null; // don't render until owner is fetched

  return (
    <div className="flex flex-col gap-2">
      <p>
        Contact <span className="font-semibold">{owner.username}</span> for{' '}
        <span className="font-semibold">{listing?.name?.toLowerCase()}</span>
      </p>

      <textarea
        placeholder="Enter your message here..."
        className="w-full border p-3 rounded-lg"
        id="message"
        rows="2"
        onChange={onChange}
        value={message}
      />

      <a
        href={`mailto:${(listing?.sellerEmail) || owner.email}?subject=Regarding ${listing?.name}&body=${encodeURIComponent(message)}`}
        className="text-white bg-slate-700 p-3 rounded-lg uppercase hover:opacity-95 mt-4 inline-block cursor-pointer"
      >
        Send Message
      </a>

    </div>
  );
}
