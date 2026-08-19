import { Product, ActivityLogItem, WeeklySalesData, Customer, Sale, CartItem, PaymentMethodType, Gasto, GastoCategoria } from '../types';
import in0001Image from '../assets/products/in0001-salchichon-cerveroni-zenu-500g.png';
import in0031Image from '../assets/products/in0031-salchichon-cerveroni-zenu-1.2kg.png';
import in0032Image from '../assets/products/in0032-mortadela-zenu-pollo-250g.png';
import mortadelaTradicionalImage from '../assets/products/mortadela-zenu-tradicional.png';
import jamonSandwichZenuImage from '../assets/products/jamon-sandwich-zenu.png';
import jamonPietranImage from '../assets/products/jamon-pietran.png';
import in0039Image from '../assets/products/in0039-salchicha-ranchera-tripack-75g.png';
import in0040Image from '../assets/products/in0040-salchicha-ranchera-pentapack-115g.png';
import in0043Image from '../assets/products/in0043-chorizo-ternera-zenu-parpack-100g.png';
import chorizoIdealRicaImage from '../assets/products/chorizo-ideal-rica.png';
import in0046Image from '../assets/products/in0046-arepas-de-chocolo.png';
import in0050Image from '../assets/products/in0050-bocadillo-el-perrito-18und.png';
import in0051Image from '../assets/products/in0051-bocadillo-barra-arequipe-400g.png';
import in0053Image from '../assets/products/in0053-bocadillo-barra-guayaba-500g.png';
import in0065Image from '../assets/products/in0065-cocacola-mega-3lt.png';
import in0066Image from '../assets/products/in0066-jugo-hit-500ml.png';
import in0067Image from '../assets/products/in0067-postobon-500ml.png';
import in0068Image from '../assets/products/in0068-gatorade-500ml.png';
import cervezaAguilaLataImage from '../assets/products/cerveza-aguila-lata.png';
import in0070Image from '../assets/products/in0070-cerveza-aguila-buchona-1lt.png';
import in0071Image from '../assets/products/in0071-cerveza-poker-buchona-1000ml.png';
import in0072Image from '../assets/products/in0072-cocacola-1.5lt.png';
import in0073Image from '../assets/products/in0073-agua-brisa-gas-600ml.png';
import in0074Image from '../assets/products/in0074-agua-brisa-600ml.png';
import in0075Image from '../assets/products/in0075-cocacola-400ml-pet.png';
import in0076Image from '../assets/products/in0076-refajo-kola-roman-330ml.png';
import in0077Image from '../assets/products/in0077-fresh-citrus-delvalle-400ml.png';
import in0078Image from '../assets/products/in0078-agua-ecoflex-1lt.png';
import in0079Image from '../assets/products/in0079-sprite-400ml.png';
import in0080Image from '../assets/products/in0080-cocacola-250ml.png';
import in0081Image from '../assets/products/in0081-cuatro-choice-400ml.png';
import in0087Image from '../assets/products/in0087-almojabanas-10und.png';
import freskaLecheImage from '../assets/products/freska-leche.png';
import in0085Image from '../assets/products/in0085-chorizo-5-pequenos.png';

// Catálogo real importado de "INVENTARIO SAFI SALSAMENTARIA.xlsx" (48
// productos con nombre, precio de venta y existencias). Se excluyeron los
// artículos desechables (vasos, platos, cubiertos) y los que no tenían
// precio de venta en el Excel, porque no son productos que se vendan al
// cliente. Los precios que en el Excel venían en "miles" (ej. 17.0) se
// multiplicaron x1000; el resto se dejó tal cual. El stock mínimo de
// alerta (minStock) es un cálculo de partida (30% del stock actual, mínimo
// 1) porque el Excel no traía ese dato — ajústalo por producto en
// Inventario cuando tengas el punto de reorden real de cada uno. Las fotos
// son genéricas por categoría (el Excel no traía imágenes reales).
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-in0001',
    code: 'IN0001',
    name: 'Salchichón Cerveroni Zenú x 500g',
    category: 'jamones_embutidos',
    price: 17000,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: true,
    description: 'Presentación x 500g',
    imageUrl: in0001Image
  },
  {
    id: 'prod-in0031',
    code: 'IN0031',
    name: 'Salchichón Cerveroni Zenú x 1.2kg',
    category: 'jamones_embutidos',
    price: 36700,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 1.2kg',
    imageUrl: in0031Image
  },
  {
    id: 'prod-in0032',
    code: 'IN0032',
    name: 'Mortadela Zenú Pollo x 250g · 14 tajadas',
    category: 'jamones_embutidos',
    price: 8200,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 250g · 14 tajadas',
    imageUrl: in0032Image
  },
  {
    id: 'prod-in0033',
    code: 'IN0033',
    name: 'Mortadela Zenú Tradicional x 250g · 15 tajadas',
    category: 'jamones_embutidos',
    price: 7800,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 250g · 15 tajadas',
    imageUrl: mortadelaTradicionalImage
  },
  {
    id: 'prod-in0034',
    code: 'IN0034',
    name: 'Mortadela Tradicional Zenú x 100g · 6 tajadas',
    category: 'jamones_embutidos',
    price: 3800,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 100g · 6 tajadas',
    imageUrl: mortadelaTradicionalImage
  },
  {
    id: 'prod-in0035',
    code: 'IN0035',
    name: 'Jamón Sandwich Zenú x 230g · 11 tajadas',
    category: 'jamones_embutidos',
    price: 10750,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: true,
    description: 'Presentación x 230g · 11 tajadas',
    imageUrl: jamonSandwichZenuImage
  },
  {
    id: 'prod-in0036',
    code: 'IN0036',
    name: 'Jamón Sandwich Zenú x 111g · 6 tajadas',
    category: 'jamones_embutidos',
    price: 5550,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 111g · 6 tajadas',
    imageUrl: jamonSandwichZenuImage
  },
  {
    id: 'prod-in0037',
    code: 'IN0037',
    name: 'Jamón Pietrán Estándar x 100g · 5 tajadas',
    category: 'jamones_embutidos',
    price: 6850,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 100g · 5 tajadas',
    imageUrl: jamonPietranImage
  },
  {
    id: 'prod-in0038',
    code: 'IN0038',
    name: 'Jamón Pietrán de Cerdo x 230g · 11 tajadas',
    category: 'jamones_embutidos',
    price: 16350,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 230g · 11 tajadas',
    imageUrl: jamonPietranImage
  },
  {
    id: 'prod-in0039',
    code: 'IN0039',
    name: 'Salchicha Ranchera Tripack x 75g · 3 salchichas',
    category: 'jamones_embutidos',
    price: 5300,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 75g · 3 salchichas',
    imageUrl: in0039Image
  },
  {
    id: 'prod-in0040',
    code: 'IN0040',
    name: 'Salchicha Ranchera Pentapack x 115g · 5 salchichas',
    category: 'jamones_embutidos',
    price: 7000,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 115g · 5 salchichas',
    imageUrl: in0040Image
  },
  {
    id: 'prod-in0041',
    code: 'IN0041',
    name: 'Salchicha Ranchera Tripack x 170g · 5 salchichas',
    category: 'jamones_embutidos',
    price: 6950,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 170g · 5 salchichas',
    imageUrl: in0040Image
  },
  {
    id: 'prod-in0042',
    code: 'IN0042',
    name: 'Chorizo Ranchera Parrilla Duopack x 96g · 2 unid',
    category: 'jamones_embutidos',
    price: 7100,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 96g · 2 unid',
    imageUrl: 'https://images.pexels.com/photos/96619/pexels-photo-96619.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0043',
    code: 'IN0043',
    name: 'Chorizo Ternera Zenú Parpack x 100g · 2 unid',
    category: 'jamones_embutidos',
    price: 4800,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 100g · 2 unid',
    imageUrl: in0043Image
  },
  {
    id: 'prod-in0044',
    code: 'IN0044',
    name: 'Chorizo Ideal Rica x 150g',
    category: 'jamones_embutidos',
    price: 5900,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 150g',
    imageUrl: chorizoIdealRicaImage
  },
  {
    id: 'prod-in0045',
    code: 'IN0045',
    name: 'Chorizo Ideal Rica x 200g',
    category: 'jamones_embutidos',
    price: 7100,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 200g',
    imageUrl: chorizoIdealRicaImage
  },
  {
    id: 'prod-in0046',
    code: 'IN0046',
    name: 'Arepas de Chócolo x 5 unidades',
    category: 'panaderia_gourmet',
    price: 10000,
    unit: 'unid',
    stock: 4.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 5 unidades',
    imageUrl: in0046Image
  },
  {
    id: 'prod-in0047',
    code: 'IN0047',
    name: 'Masato Casero x 500ml',
    category: 'bebidas',
    price: 6000,
    unit: 'unid',
    stock: 10.0,
    minStock: 3,
    isWeightBased: false,
    isFavorite: true,
    description: 'Presentación x 500ml',
    imageUrl: 'https://images.pexels.com/photos/5804024/pexels-photo-5804024.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0048',
    code: 'IN0048',
    name: 'Masato Casero x 2lt',
    category: 'bebidas',
    price: 13000,
    unit: 'unid',
    stock: 4.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 2lt',
    imageUrl: 'https://images.pexels.com/photos/5804024/pexels-photo-5804024.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0049',
    code: 'IN0049',
    name: 'Masato Casero x 3lt',
    category: 'bebidas',
    price: 18000,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 3lt',
    imageUrl: 'https://images.pexels.com/photos/5804024/pexels-photo-5804024.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0050',
    code: 'IN0050',
    name: 'Bocadillo El Perrito x 18 unidades',
    category: 'abarrotes',
    price: 6000,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 18 unidades',
    imageUrl: in0050Image
  },
  {
    id: 'prod-in0051',
    code: 'IN0051',
    name: 'Bocadillo en Barra Arequipe x 400g',
    category: 'abarrotes',
    price: 10000,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 400g',
    imageUrl: in0051Image
  },
  {
    id: 'prod-in0052',
    code: 'IN0052',
    name: 'Bocadillo en Barra Leche x 400g',
    category: 'abarrotes',
    price: 6000,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 400g',
    imageUrl: in0051Image
  },
  {
    id: 'prod-in0053',
    code: 'IN0053',
    name: 'Bocadillo en Barra Guayaba x 500g',
    category: 'abarrotes',
    price: 8500,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 500g',
    imageUrl: in0053Image
  },
  {
    id: 'prod-in0065',
    code: 'IN0065',
    name: 'Coca-Cola Mega x 3lt',
    category: 'bebidas',
    price: 12000,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 3lt',
    imageUrl: in0065Image
  },
  {
    id: 'prod-in0066',
    code: 'IN0066',
    name: 'Jugo Hit x 500ml',
    category: 'bebidas',
    price: 3000,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 500ml',
    imageUrl: in0066Image
  },
  {
    id: 'prod-in0067',
    code: 'IN0067',
    name: 'Postobón x 500ml',
    category: 'bebidas',
    price: 2500,
    unit: 'unid',
    stock: 4.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 500ml',
    imageUrl: in0067Image
  },
  {
    id: 'prod-in0068',
    code: 'IN0068',
    name: 'Gatorade x 500ml',
    category: 'bebidas',
    price: 4000,
    unit: 'unid',
    stock: 4.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 500ml',
    imageUrl: in0068Image
  },
  {
    id: 'prod-in0069',
    code: 'IN0069',
    name: 'Cerveza Águila Lata x 330ml',
    category: 'vinos_licores',
    price: 3500,
    unit: 'unid',
    stock: 0.0,
    minStock: 2,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 330ml',
    imageUrl: cervezaAguilaLataImage
  },
  {
    id: 'prod-in0070',
    code: 'IN0070',
    name: 'Cerveza Águila Buchona x 1lt',
    category: 'vinos_licores',
    price: 6500,
    unit: 'unid',
    stock: 0.0,
    minStock: 2,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 1lt',
    imageUrl: in0070Image
  },
  {
    id: 'prod-in0071',
    code: 'IN0071',
    name: 'Cerveza Poker Buchona x 1000ml',
    category: 'vinos_licores',
    price: 6500,
    unit: 'unid',
    stock: 0.0,
    minStock: 2,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 1000ml',
    imageUrl: in0071Image
  },
  {
    id: 'prod-in0072',
    code: 'IN0072',
    name: 'Coca-Cola x 1.5lt',
    category: 'bebidas',
    price: 6000,
    unit: 'unid',
    stock: 12.0,
    minStock: 4,
    isWeightBased: false,
    isFavorite: true,
    description: 'Presentación x 1.5lt',
    imageUrl: in0072Image
  },
  {
    id: 'prod-in0073',
    code: 'IN0073',
    name: 'Agua Brisa con Gas x 600ml',
    category: 'bebidas',
    price: 2000,
    unit: 'unid',
    stock: 24.0,
    minStock: 7,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 600ml',
    imageUrl: in0073Image
  },
  {
    id: 'prod-in0074',
    code: 'IN0074',
    name: 'Agua Brisa x 600ml',
    category: 'bebidas',
    price: 2000,
    unit: 'unid',
    stock: 24.0,
    minStock: 7,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 600ml',
    imageUrl: in0074Image
  },
  {
    id: 'prod-in0075',
    code: 'IN0075',
    name: 'Coca-Cola x 400ml pet',
    category: 'bebidas',
    price: 3000,
    unit: 'unid',
    stock: 12.0,
    minStock: 4,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 400ml pet',
    imageUrl: in0075Image
  },
  {
    id: 'prod-in0076',
    code: 'IN0076',
    name: 'Refajo Kola Román x 330ml lata',
    category: 'vinos_licores',
    price: 2500,
    unit: 'unid',
    stock: 0.0,
    minStock: 2,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 330ml lata',
    imageUrl: in0076Image
  },
  {
    id: 'prod-in0077',
    code: 'IN0077',
    name: 'Fresh Citrus del Valle x 400ml pet',
    category: 'bebidas',
    price: 2000,
    unit: 'unid',
    stock: 12.0,
    minStock: 4,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 400ml pet',
    imageUrl: in0077Image
  },
  {
    id: 'prod-in0078',
    code: 'IN0078',
    name: 'Agua Ecoflex x 1lt',
    category: 'bebidas',
    price: 2500,
    unit: 'unid',
    stock: 12.0,
    minStock: 4,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 1lt',
    imageUrl: in0078Image
  },
  {
    id: 'prod-in0079',
    code: 'IN0079',
    name: 'Sprite x 400ml',
    category: 'bebidas',
    price: 2500,
    unit: 'unid',
    stock: 12.0,
    minStock: 4,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 400ml',
    imageUrl: in0079Image
  },
  {
    id: 'prod-in0080',
    code: 'IN0080',
    name: 'Coca-Cola x 250ml',
    category: 'bebidas',
    price: 2000,
    unit: 'unid',
    stock: 12.0,
    minStock: 4,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 250ml',
    imageUrl: in0080Image
  },
  {
    id: 'prod-in0081',
    code: 'IN0081',
    name: 'Cuatro Choice x 400ml',
    category: 'bebidas',
    price: 2500,
    unit: 'unid',
    stock: 12.0,
    minStock: 4,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 400ml',
    imageUrl: in0081Image
  },
  {
    id: 'prod-in0082',
    code: 'IN0082',
    name: 'Rellena x 5 cocteleras',
    category: 'jamones_embutidos',
    price: 6500,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 5 cocteleras',
    imageUrl: 'https://images.pexels.com/photos/96619/pexels-photo-96619.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0083',
    code: 'IN0083',
    name: 'Rellena x 3 medianas',
    category: 'jamones_embutidos',
    price: 7000,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 3 medianas',
    imageUrl: 'https://images.pexels.com/photos/96619/pexels-photo-96619.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0084',
    code: 'IN0084',
    name: 'Rellena x 2 grandes',
    category: 'jamones_embutidos',
    price: 5500,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 2 grandes',
    imageUrl: 'https://images.pexels.com/photos/96619/pexels-photo-96619.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0085',
    code: 'IN0085',
    name: 'Chorizo x 5 pequeños',
    category: 'jamones_embutidos',
    price: 6500,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 5 pequeños',
    imageUrl: in0085Image
  },
  {
    id: 'prod-in0087',
    code: 'IN0087',
    name: 'Almojábanas x 10 unidades',
    category: 'panaderia_gourmet',
    price: 2000,
    unit: 'unid',
    stock: 10.0,
    minStock: 3,
    isWeightBased: false,
    isFavorite: true,
    description: 'Presentación x 10 unidades',
    imageUrl: in0087Image
  },
  {
    id: 'prod-in0088',
    code: 'IN0088',
    name: 'Freska Leche Entera x 900ml',
    category: 'huevos_lacteos',
    price: 4200,
    unit: 'unid',
    stock: 5.0,
    minStock: 2,
    isWeightBased: false,
    isFavorite: true,
    description: 'Presentación x 900ml',
    imageUrl: freskaLecheImage
  },
  {
    id: 'prod-in0089',
    code: 'IN0089',
    name: 'Freska Leche Deslactosada x 1100ml',
    category: 'huevos_lacteos',
    price: 5500,
    unit: 'unid',
    stock: 5.0,
    minStock: 2,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 1100ml',
    imageUrl: freskaLecheImage
  },
  // --- Desechables: antes excluidos del inventario por no tener precio de venta
  // asignado en el Excel original; ahora sí se venden con el precio indicado por Laura.
  // IN0064 no traía precio en la hoja: se asumió $6.450 igual al resto de la línea
  // "Cubiertos Fresh" (mismo empaque x100 unid) — confirmar con Laura.
  {
    id: 'prod-in0054',
    code: 'IN0054',
    name: 'Vaso Foam Desechable x 7oz',
    category: 'desechables',
    price: 2100,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Paquete x 7oz',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0055',
    code: 'IN0055',
    name: 'Vaso Vasander Darnel x 3.1oz',
    category: 'desechables',
    price: 1600,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Paquete x 3.1oz',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0056',
    code: 'IN0056',
    name: 'Contenedor Darnel con Tapa x 24oz · 20 unid',
    category: 'desechables',
    price: 12500,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 24oz · 20 unid',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0057',
    code: 'IN0057',
    name: 'Contenedor Darnel con Tapa x 16oz · 20 unid',
    category: 'desechables',
    price: 11500,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 16oz · 20 unid',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0058',
    code: 'IN0058',
    name: 'Plato Darnel Hondo x 25oz · 20 unid',
    category: 'desechables',
    price: 5000,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 25oz · 20 unid',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0059',
    code: 'IN0059',
    name: 'Plato Darnel Pandos x 23cm · 20 unid',
    category: 'desechables',
    price: 5200,
    unit: 'unid',
    stock: 3.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 23cm · 20 unid',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0060',
    code: 'IN0060',
    name: 'Plato Darnel Pandos x 15cm · 20 unid',
    category: 'desechables',
    price: 2600,
    unit: 'unid',
    stock: 5.0,
    minStock: 2,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 15cm · 20 unid',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0061',
    code: 'IN0061',
    name: 'Cubiertos Fresh Cuchara x 100 unid',
    category: 'desechables',
    price: 6450,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 100 unid',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0062',
    code: 'IN0062',
    name: 'Cubiertos Fresh Tenedor x 100 unid',
    category: 'desechables',
    price: 6450,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 100 unid',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0063',
    code: 'IN0063',
    name: 'Cubiertos Fresh Cuchillo x 100 unid',
    category: 'desechables',
    price: 6450,
    unit: 'unid',
    stock: 2.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 100 unid',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'prod-in0064',
    code: 'IN0064',
    name: 'Cubiertos Fresh Cuchara Pequeña x 100 unid',
    category: 'desechables',
    price: 6450,
    unit: 'unid',
    stock: 1.0,
    minStock: 1,
    isWeightBased: false,
    isFavorite: false,
    description: 'Presentación x 100 unid · precio asumido, confirmar con Laura',
    imageUrl: 'https://images.pexels.com/photos/1051743/pexels-photo-1051743.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Restaurante El Bistró S.A.S',
    document: '900.812.441-2',
    phone: '310 458 9021',
    type: 'empresa'
  },
  {
    id: 'cust-2',
    name: 'Carlos Mendoza',
    document: '1020.841.902',
    phone: '315 882 1104',
    type: 'frecuente'
  },
  {
    id: 'cust-3',
    name: 'María Fernanda Rojas',
    document: '52.441.802',
    phone: '320 901 3345',
    type: 'general'
  }
];

export const MOCK_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'act-1',
    productName: 'Salami Italiano Premium',
    quantityStr: '2.5 kg • Hace 10 min',
    amount: 87500,
    timeAgo: 'Hace 10 min'
  },
  {
    id: 'act-2',
    productName: 'Jamón Serrano Reserva',
    quantityStr: '0.8 kg • Hace 22 min',
    amount: 124000,
    timeAgo: 'Hace 22 min'
  },
  {
    id: 'act-3',
    productName: 'Queso Manchego DOP',
    quantityStr: '1.2 kg • Hace 45 min',
    amount: 92300,
    timeAgo: 'Hace 45 min'
  },
  {
    id: 'act-4',
    productName: 'Mortadela Pistacho',
    quantityStr: '3.0 kg • Hace 1 hora',
    amount: 45000,
    timeAgo: 'Hace 1 hora'
  }
];

export const MOCK_WEEKLY_SALES: WeeklySalesData[] = [
  { day: 'Lun', actual: 1850000, previous: 1540000 },
  { day: 'Mar', actual: 2420000, previous: 2100000 },
  { day: 'Mie', actual: 1620000, previous: 1980000 },
  { day: 'Jue', actual: 3100000, previous: 2200000 },
  { day: 'Vie', actual: 3850000, previous: 3100000 },
  { day: 'Sab', actual: 4420000, previous: 3950000 },
  { day: 'Dom', actual: 2100000, previous: 1450000 }
];

// --- Historial de ventas de ejemplo (~5 meses) ---
// Sirve para que el filtro de Día/Mes/Año/Rango del Dashboard tenga datos
// reales con qué trabajar desde ya. Cuando la app se conecte a las ventas
// reales guardadas en Supabase, esto se reemplaza por la consulta real y
// las ventas que se completen en la sesión seguirán sumándose igual.
function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMockSalesHistory(): Sale[] {
  const rand = mulberry32(20260803);
  const sales: Sale[] = [];
  const paymentMethods: PaymentMethodType[] = ['efectivo', 'tarjeta', 'transferencia'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let saleCounter = 1;
  const daysBack = 150;

  for (let d = daysBack; d >= 1; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const salesToday = Math.floor(rand() * (isWeekend ? 6 : 4)) + (isWeekend ? 2 : 1);

    for (let s = 0; s < salesToday; s++) {
      const itemCount = Math.floor(rand() * 3) + 1;
      const items: CartItem[] = [];
      const usedIds = new Set<string>();

      for (let i = 0; i < itemCount; i++) {
        const product = INITIAL_PRODUCTS[Math.floor(rand() * INITIAL_PRODUCTS.length)];
        if (usedIds.has(product.id)) continue;
        usedIds.add(product.id);

        const quantity = product.unit === 'kg'
          ? Number((0.15 + rand() * 1.2).toFixed(3))
          : Math.floor(rand() * 3) + 1;
        const subtotal = Math.round(quantity * product.price);
        items.push({ product, quantity, subtotal });
      }

      if (items.length === 0) continue;

      const subtotal = items.reduce((acc, it) => acc + it.subtotal, 0);
      const tax = Math.round(subtotal * 0.19);
      const total = subtotal + tax;
      const timestamp = new Date(date);
      timestamp.setHours(8 + Math.floor(rand() * 11), Math.floor(rand() * 60), 0, 0);

      // ~55% de las ventas quedan asociadas a un cliente registrado (el resto
      // son ventas de mostrador sin cliente asignado), para que el ranking de
      // clientes frecuentes tenga datos reales con qué trabajar desde ya.
      const customer = rand() < 0.55
        ? MOCK_CUSTOMERS[Math.floor(rand() * MOCK_CUSTOMERS.length)]
        : undefined;

      sales.push({
        id: `hist-sale-${saleCounter}`,
        receiptNumber: `TICK-${100000 + saleCounter}`,
        timestamp,
        items,
        subtotal,
        tax,
        total,
        paymentMethod: paymentMethods[Math.floor(rand() * paymentMethods.length)],
        customer,
        cashierName: 'Admin Salsamentaría'
      });
      saleCounter++;
    }
  }

  return sales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const MOCK_SALES_HISTORY: Sale[] = generateMockSalesHistory();

// --- Historial de gastos/salidas de caja de ejemplo (~5 meses) ---
// Igual que con las ventas, esto es solo para que la pantalla de Gastos y
// Caja tenga datos reales con qué trabajar desde ya. No representa gastos
// reales del negocio todavía (eso llega cuando se conecte la info real).
const GASTO_CATEGORIAS: { categoria: GastoCategoria; descripciones: string[]; montoMin: number; montoMax: number }[] = [
  { categoria: 'compra_proveedor', descripciones: ['Compra de mercancía a proveedor', 'Reposición de inventario'], montoMin: 300000, montoMax: 2200000 },
  { categoria: 'servicios_publicos', descripciones: ['Pago de energía eléctrica', 'Pago de acueducto y aseo', 'Pago de internet y telefonía'], montoMin: 80000, montoMax: 420000 },
  { categoria: 'nomina', descripciones: ['Pago de nómina quincenal'], montoMin: 900000, montoMax: 1800000 },
  { categoria: 'transporte_domicilios', descripciones: ['Transporte de mercancía', 'Pago de domicilios'], montoMin: 20000, montoMax: 150000 },
  { categoria: 'arriendo', descripciones: ['Pago de arriendo del local'], montoMin: 1200000, montoMax: 1200000 },
  { categoria: 'mantenimiento', descripciones: ['Mantenimiento de neveras y vitrinas', 'Mantenimiento de gramera'], montoMin: 50000, montoMax: 350000 }
];

function generateMockGastosHistory(): Gasto[] {
  const rand = mulberry32(20260804);
  const gastos: Gasto[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let counter = 1;
  const daysBack = 150;

  for (let d = daysBack; d >= 1; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dayOfMonth = date.getDate();

    // Arriendo el día 5, nómina los días 15 y 30 de cada mes
    if (dayOfMonth === 5) {
      gastos.push(makeGasto(counter++, date, rand, GASTO_CATEGORIAS[4]));
    }
    if (dayOfMonth === 15 || dayOfMonth === 30) {
      gastos.push(makeGasto(counter++, date, rand, GASTO_CATEGORIAS[2]));
    }

    // Entre 0 y 2 gastos operativos adicionales por día (compras, servicios, transporte, mantenimiento)
    const extraCount = Math.floor(rand() * 3);
    for (let i = 0; i < extraCount; i++) {
      const pool = [GASTO_CATEGORIAS[0], GASTO_CATEGORIAS[1], GASTO_CATEGORIAS[3], GASTO_CATEGORIAS[5]];
      const cat = pool[Math.floor(rand() * pool.length)];
      gastos.push(makeGasto(counter++, date, rand, cat));
    }
  }

  return gastos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

function makeGasto(
  id: number,
  date: Date,
  rand: () => number,
  cat: { categoria: GastoCategoria; descripciones: string[]; montoMin: number; montoMax: number }
): Gasto {
  const fecha = new Date(date);
  fecha.setHours(9 + Math.floor(rand() * 9), Math.floor(rand() * 60), 0, 0);
  const monto = Math.round((cat.montoMin + rand() * (cat.montoMax - cat.montoMin)) / 1000) * 1000;
  const descripcion = cat.descripciones[Math.floor(rand() * cat.descripciones.length)];
  return {
    id: `hist-gasto-${id}`,
    fecha,
    tipo: 'egreso',
    categoria: cat.categoria,
    descripcion,
    monto
  };
}

export const MOCK_GASTOS_HISTORY: Gasto[] = generateMockGastosHistory();

export const MOCK_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Embutidos y Madurados Ibéricos S.L.',
    nit: '830.124.990-1',
    category: 'Jamones y Embutidos',
    contactPerson: 'Fernando Gómez',
    phone: '(601) 745-8820',
    status: 'activo',
    lastOrder: '2026-07-28'
  },
  {
    id: 'sup-2',
    name: 'Lácteos del Valle y Sabana',
    nit: '860.012.445-8',
    category: 'Quesos Artesanales',
    contactPerson: 'Helena Suárez',
    phone: '318 402 1199',
    status: 'activo',
    lastOrder: '2026-07-30'
  },
  {
    id: 'sup-3',
    name: 'Importadora de Vinos Med S.A.',
    nit: '900.412.332-5',
    category: 'Vinos y Licores',
    contactPerson: 'Alejandro Parra',
    phone: '(604) 310-9080',
    status: 'activo',
    lastOrder: '2026-07-22'
  },
  {
    id: 'sup-4',
    name: 'Avícola Santa Clara',
    nit: '890.311.200-4',
    category: 'Huevos y Aves',
    contactPerson: 'Rosaura Jiménez',
    phone: '311 890 2234',
    status: 'activo',
    lastOrder: '2026-08-01'
  }
];
