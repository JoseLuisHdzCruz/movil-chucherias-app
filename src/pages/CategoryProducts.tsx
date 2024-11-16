import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonTitle, IonChip, IonContent, IonPage } from '@ionic/react';
import axios from 'axios';
import ListaProductos from '../components/ListaProductos';
import LayoutPage from '../components/LayoutPage';
import './CategoryProducts.css'

interface RouteParams {
    categoriaId: string;
}

interface Category {
    categoriaId: number;
    categoria: string;
}

const CategoryProducts: React.FC = () => {
    const { categoriaId } = useParams<RouteParams>();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const productResponse = await axios.get(`https://backend-c-r-production.up.railway.app/products/categoria/${categoriaId}`);
                setProducts(productResponse.data);
            } catch (error) {
                console.error('Error fetching products by category:', error);
            }
        };

        const fetchCategoryName = async () => {
            try {
                const categoryResponse = await axios.get('https://backend-c-r-production.up.railway.app/products/categories/getAll');
                const category = categoryResponse.data.find((cat: Category) => cat.categoriaId.toString() === categoriaId);
                if (category) {
                    setCategoryName(category.categoria);
                }
            } catch (error) {
                console.error('Error fetching category name:', error);
            }
        };

        fetchProductsByCategory();
        fetchCategoryName();
    }, [categoriaId]);

    return (

        <IonPage>
            <LayoutPage>
                <IonContent>
                    <ListaProductos products={products} />
                </IonContent>
            </LayoutPage>
        </IonPage>

    );
};

export default CategoryProducts;
