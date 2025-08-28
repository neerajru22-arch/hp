
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { Recipe } from '../types';
import Button from '../components/Button';
import { PlusIcon } from '../components/icons/Icons';
import Modal from '../components/Modal';

const RecipeCard: React.FC<{ recipe: Recipe; onSelect: (recipe: Recipe) => void }> = ({ recipe, onSelect }) => {
    const actualMargin = ((recipe.costPerPortion * (1 + recipe.targetMargin / 100)) - recipe.costPerPortion) / (recipe.costPerPortion * (1 + recipe.targetMargin / 100)) * 100;
    const marginColor = actualMargin >= recipe.targetMargin ? 'text-success' : 'text-danger';

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(recipe)}>
            <h3 className="font-semibold text-secondary">{recipe.name}</h3>
            <p className="text-sm text-slate-600">{recipe.category}</p>
            <div className="mt-4 flex justify-between items-baseline">
                <div>
                    <p className="text-xs text-slate-500">Cost/Portion</p>
                    <p className="font-bold text-lg text-primary">${recipe.costPerPortion.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 text-right">Target Margin</p>
                    <p className={`font-semibold text-right ${marginColor}`}>{recipe.targetMargin}%</p>
                </div>
            </div>
        </div>
    );
};

const RecipeDetailModal: React.FC<{ recipe: Recipe; onClose: () => void }> = ({ recipe, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title={recipe.name}>
             <div className="p-6 max-h-[60vh] overflow-y-auto">
                <p className="text-sm text-slate-600 mb-4">{recipe.category}</p>
                <h4 className="font-semibold mb-2">Ingredients</h4>
                <ul className="divide-y divide-slate-200">
                    {recipe.ingredients.map(ing => (
                        <li key={ing.name} className="py-2 flex justify-between">
                            <span>{ing.name} ({ing.quantity} {ing.unit})</span>
                            <span className="font-medium">${ing.cost.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                 <div className="mt-4 pt-4 border-t flex justify-between font-bold text-lg">
                    <span>Total Ingredient Cost</span>
                    <span>${recipe.ingredients.reduce((sum, i) => sum + i.cost, 0).toFixed(2)}</span>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end space-x-4">
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={() => alert('This would update prices from live inventory.')}>Update Live Costs</Button>
            </div>
        </Modal>
    );
};


const Recipes: React.FC = () => {
  const { data: recipes, loading, error } = useApi(api.getRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-secondary">Recipe & Menu Costing</h2>
        <Button onClick={() => alert('Opening new recipe form...')} leftIcon={<PlusIcon className="w-5 h-5"/>}>
          New Recipe
        </Button>
      </div>

      {loading && <div className="text-center p-8">Loading recipes...</div>}
      {error && <div className="text-center p-8 text-danger">Failed to load recipes.</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes?.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onSelect={setSelectedRecipe} />
        ))}
      </div>

      {selectedRecipe && <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
};

export default Recipes;
