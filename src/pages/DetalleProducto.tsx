import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
    IonPage,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonText,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonChip,
    IonButton,
    IonIcon,
} from '@ionic/react';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import LayoutPage from '../components/LayoutPage';
import ProductCarousel from '../components/ProductCarousel';
import { useCart } from '../contexts/CartContext';
import './DetalleProducto.css';

interface Product {
    productoId: number;
    nombre: string;
    descripcion: string;
    precioFinal: number;
    imagen: string;
    existencia: number;
    descuento: number;
    ranking: number;
    IVA: number;
}

interface RouteParams {
    productId: string;
}

const DetalleProducto: React.FC = () => {
    const { productId } = useParams<RouteParams>();
    const { addItem } = useCart(); // Acceder a la función addItem desde el contexto del carrito
    const [product, setProduct] = useState<Product | null>(null);
    const [carouselProducts, setCarouselProducts] = useState<Product[]>([]);
    const [quantity, setQuantity] = useState<number>(1); // Estado para la cantidad seleccionada
    const history = useHistory();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://backend-c-r-production.up.railway.app/products/${productId}`);
                setProduct(response.data);

                // Consumir la API para los productos del carrusel
                const carouselResponse = await fetch('https://backend-c-r-production.up.railway.app/products/randomProducts');
                const carouselData = await carouselResponse.json();
                setCarouselProducts(carouselData);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    // Función para manejar el incremento de cantidad
    const increaseQuantity = () => {
        if (product && quantity < product.existencia) {
            setQuantity(quantity + 1);
        }
    };

    // Función para manejar el decremento de cantidad
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Función para agregar al carrito
    const addToCart = () => {
        if (product) {
            const cartItem = {
                productoId: product.productoId,
                producto: product.nombre,
                precio: product.precioFinal,
                cantidad: quantity,
                imagen: product.imagen,
                IVA: product.IVA,
            };

            // Agregar al carrito usando el contexto
            addItem(cartItem);

            // Redirigir a la página del carrito
            history.push('/cart');
        }
    };

    return (
        <IonPage>
            <LayoutPage>
                <IonContent>
                    <IonChip outline={true} className='margin-top'>Detalle del producto</IonChip>
                    {product ? (
                        <IonCard className='card'>
                            <IonImg src={product.imagen} alt={product.nombre} className='img-producto' />
                            <IonCardHeader>
                                <IonTitle>{product.nombre}</IonTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonText>
                                    <p>{product.descripcion}</p>
                                    <p><strong>Precio:</strong> ${product.precioFinal}</p>
                                    {product.descuento > 0 && <p><strong>Descuento:</strong> {product.descuento}%</p>}
                                    <p><strong>Existencia:</strong> {product.existencia}</p>
                                    <p><strong>Ranking:</strong> {product.ranking}/5</p>
                                    <p><strong>IVA:</strong> {product.IVA}</p>
                                </IonText>

                                {/* Controles de cantidad */}
                                <div className="quantity-controls">
                                    <IonButton onClick={decreaseQuantity} disabled={quantity <= 1}>
                                        <IonIcon icon={removeCircleOutline} />
                                    </IonButton>
                                    <IonText>{quantity}</IonText>
                                    <IonButton onClick={increaseQuantity} disabled={quantity >= product.existencia}>
                                        <IonIcon icon={addCircleOutline} />
                                    </IonButton>
                                </div>

                                {/* Botón para agregar al carrito */}
                                <IonButton expand="block" onClick={addToCart}>
                                    Agregar al carrito
                                </IonButton>
                            </IonCardContent>
                        </IonCard>
                    ) : (
                        <IonText>Cargando detalles del producto...</IonText>
                    )}

                    {/* Carrusel de productos */}
                    <IonChip outline={true}>Puede interesarte</IonChip>
                    {carouselProducts.length > 0 ? (
                        <ProductCarousel products={carouselProducts} />
                    ) : (
                        <IonText color="danger">No hay productos disponibles</IonText>
                    )}
                </IonContent>
            </LayoutPage>
        </IonPage>
    );
};

export default DetalleProducto;
