import React from 'react';

const NewProjectScreen: React.FC = () => {
    return (
        <main className="flex-1 p-6 bg-neutral-100/50 overflow-y-auto">
            <h1 className="text-3xl font-bold text-neutral-800 mb-6">Criar Novo Projeto</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
                <form className="space-y-6">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-neutral-700">Nome do Projeto</label>
                        <input type="text" id="projectName" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-neutral-700">Nome do Cliente</label>
                        <input type="text" id="clientName" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="projectValue" className="block text-sm font-medium text-neutral-700">Valor (R$)</label>
                        <input type="number" id="projectValue" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-neutral-700">Prazo Final</label>
                        <input type="date" id="deadline" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
                            Salvar Projeto
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default NewProjectScreen;
