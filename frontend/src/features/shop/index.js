import ShopButton from './components/ShopButton'
import ShopWrapper from './components/ShopWrapper'
import ItemDescription from './components/ItemDescription'
import ItemButton from './components/ItemButton'

export { ShopButton, ShopWrapper, ItemDescription, ItemButton }
export * from './hooks'

const rarityData = {
	1: {
		color: 'var(--gray)',
		price: '400'
	},
	2: {
		color: 'green',
		price: '800'
	},
	3: {
		color: 'var(--purple)',
		price: '1500'
	},
	4: {
		color: 'var(--yellow)',
		price: '2000'
	}
}

export { rarityData }
