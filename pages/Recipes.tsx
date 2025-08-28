import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { Recipe, UserRole, Ingredient } from '../types';
import Button from '../components/Button';
import { PlusIcon, TrashIcon, PencilIcon } from '../components/icons/Icons';
import Modal from '../components/Modal';
import { useAuth } from '../auth/AuthContext';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

// --- Form for Add/Edit Recipe ---
const RecipeForm: React.FC<{
    recipe: Partial<Recipe>;
    onSave: (recipe: Partial<Recipe>) => void;
    onClose: () => void;
}> = ({ recipe, onSave, onClose }) => {
    const [formData, setFormData] = useState<Partial<Recipe>>({ ingredients: [], ...recipe });
    const [cost, setCost] = useState(recipe.costPerPortion || 0);

    useEffect(() => {
        const totalCost = formData.ingredients?.reduce((sum, ing) => sum + (Number(ing.cost) || 0), 0) || 0;
        setCost(totalCost);
        setFormData(prev => ({...prev, costPerPortion: totalCost }));
    }, [formData.ingredients]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'targetMargin' ? Number(value) : value }));
    };

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
        const newIngredients = [...(formData.ingredients || [])];
        const updatedIngredient = { ...newIngredients[index], [field]: value };
        newIngredients[index] = updatedIngredient;
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const addIngredient = () => {
        const newIngredients = [...(formData.ingredients || []), { name: '', quantity: 0, unit: '', cost: 0 }];
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const removeIngredient = (index: number) => {
        const newIngredients = formData.ingredients?.filter((_, i) => i !== index) || [];
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Recipe Name</label>
                        <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                        <input type="text" name="category" id="category" value={formData.category || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Ingredients</h4>
                    <div className="space-y-3">
                        {formData.ingredients?.map((ing, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center p-2 bg-slate-50 rounded">
                                <input type="text" placeholder="Name" value={ing.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} required className="md:col-span-3 mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                                <input type="number" placeholder="Qty" value={ing.quantity} onChange={e => handleIngredientChange(index, 'quantity', Number(e.target.value))} required className="md:col-span-1 mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                                <input type="text" placeholder="Unit" value={ing.unit} onChange={e => handleIngredientChange(index, 'unit', e.target.value)} required className="md:col-span-2 mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                                <input type="number" placeholder="Cost" value={ing.cost} onChange={e => handleIngredientChange(index, 'cost', Number(e.target.value))} required className="md:col-span-2 mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                                <button type="button" onClick={() => removeIngredient(index)} className="text-red-500 hover:text-red-700 p-1 justify-self-center">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                     <Button type="button" variant="secondary" size="sm" onClick={addIngredient} leftIcon={<PlusIcon className="w-4 h-4"/>} className="mt-3">
                        Add Ingredient
                    </Button>
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                     <div>
                        <label htmlFor="targetMargin" className="block text-sm font-medium text-slate-700">Target Margin (%)</label>
                        <input type="number" name="targetMargin" id="targetMargin" min="0" value={formData.targetMargin || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Calculated Cost/Portion</label>
                        <p className="mt-1 text-lg font-bold text-primary px-3 py-2 bg-slate-100 rounded-md">{formatCurrency(cost)}</p>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-b-lg flex justify-end space-x-4">
                <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                <Button variant="primary" type="submit">Save Recipe</Button>
            </div>
        </form>
    );
};

// --- Modals for View/Edit ---
const RecipeDetailModal: React.FC<{ 
    recipe: Recipe; 
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ recipe, onClose, onEdit, onDelete }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title={recipe.name}>
             <div className="p-6 max-h-[60vh] overflow-y-auto">
                <p className="text-sm text-slate-600 mb-4">{recipe.category}</p>
                <h4 className="font-semibold mb-2">Ingredients</h4>
                <ul className="divide-y divide-slate-200">
                    {recipe.ingredients.map(ing => (
                        <li key={ing.name} className="py-2 flex justify-between">
                            <span>{ing.name} ({ing.quantity} {ing.unit})</span>
                            <span className="font-medium">{formatCurrency(ing.cost)}</span>
                        </li>
                    ))}
                </ul>
                 <div className="mt-4 pt-4 border-t flex justify-between font-bold text-lg">
                    <span>Total Cost / Portion</span>
                    <span>{formatCurrency(recipe.costPerPortion)}</span>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-b-lg flex justify-between">
                <Button variant="danger" onClick={onDelete}>Delete</Button>
                <div className="space-x-2">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button variant="primary" onClick={onEdit}>Edit</Button>
                </div>
            </div>
        </Modal>
    );
};


const Recipes: React.FC = () => {
  const { user } = useAuth();
  const { data: recipes, loading, error, refetch } = useApi(api.getRecipes);
  const [modalState, setModalState] = useState<{ type: 'detail' | 'edit' | 'new'; recipe: Partial<Recipe> | null }>({ type: 'detail', recipe: null });

  const canManageRecipes = user && [UserRole.Admin, UserRole.RestaurantOwner, UserRole.Chef].includes(user.role);

  const handleCloseModal = () => {
      setModalState({ type: 'detail', recipe: null });
  };
  
  const handleSelectRecipe = (recipe: Recipe) => {
    setModalState({ type: 'detail', recipe });
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setModalState({ type: 'edit', recipe });
  };

  const handleNewRecipe = () => {
    setModalState({ type: 'new', recipe: {} });
  };

  const handleDeleteRecipe = async (recipeId: string) => {
      if(window.confirm('Are you sure you want to delete this recipe?')) {
          await api.deleteRecipe(recipeId);
          refetch();
          handleCloseModal();
      }
  };

  const handleSaveRecipe = async (recipeData: Partial<Recipe>) => {
    try {
        if (recipeData.id) {
            await api.updateRecipe(recipeData as Recipe);
        } else {
            await api.addRecipe(recipeData as Omit<Recipe, 'id'>);
        }
        refetch();
        handleCloseModal();
    } catch (e) {
        console.error("Failed to save recipe", e);
        alert("Could not save recipe.");
    }
  };
  
  const RecipeCard: React.FC<{ recipe: Recipe; onSelect: (recipe: Recipe) => void }> = ({ recipe, onSelect }) => {
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(recipe)}>
            <h3 className="font-semibold text-secondary">{recipe.name}</h3>
            <p className="text-sm text-slate-600">{recipe.category}</p>
            <div className="mt-4 flex justify-between items-baseline">
                <div>
                    <p className="text-xs text-slate-500">Cost/Portion</p>
                    <p className="font-bold text-lg text-primary">{formatCurrency(recipe.costPerPortion)}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 text-right">Target Margin</p>
                    <p className={`font-semibold text-right text-success`}>{recipe.targetMargin}%</p>
                </div>
            </div>
        </div>
    );
  };
  
  if (!canManageRecipes) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
            <p className="text-slate-600 mt-2">You do not have permission to view or manage recipes.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-semibold text-secondary">Recipe & Menu Costing</h2>
        <Button onClick={handleNewRecipe} leftIcon={<PlusIcon className="w-5 h-5"/>}>
          New Recipe
        </Button>
      </div>

      {loading && <div className="text-center p-8">Loading recipes...</div>}
      {error && <div className="text-center p-8 text-danger">Failed to load recipes.</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes?.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onSelect={handleSelectRecipe} />
        ))}
      </div>

      {modalState.recipe && modalState.type === 'detail' && (
        <RecipeDetailModal 
            recipe={modalState.recipe as Recipe} 
            onClose={handleCloseModal}
            onEdit={() => handleEditRecipe(modalState.recipe as Recipe)}
            onDelete={() => handleDeleteRecipe(modalState.recipe!.id!)}
        />
      )}

      {(modalState.type === 'new' || modalState.type === 'edit') && modalState.recipe && (
        <Modal
            isOpen={true}
            onClose={handleCloseModal}
            title={modalState.type === 'edit' ? 'Edit Recipe' : 'Add New Recipe'}
        >
            <RecipeForm recipe={modalState.recipe} onSave={handleSaveRecipe} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default Recipes;