
import React from 'react';

const Logos: React.FC = () => {
    const companies = ["ITAÚ", "AMBEV", "NUBANK", "MERCADO LIVRE", "IFOOD", "XP"];
    return (
        <section className="border-y border-gray-100 bg-white py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Nossos usuários foram contratados por</p>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-6 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {companies.map(company => (
                        <div key={company} className="flex justify-center text-xl font-bold text-gray-800">{company}</div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Logos;
