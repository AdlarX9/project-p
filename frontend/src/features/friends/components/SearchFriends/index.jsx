import './style.css'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import axios from 'axios'

import { getFriends, getToken } from '@redux/selectors'
import Loader from '@components/Loader'
import FriendDetails from '../FriendDetails'
import FriendButton from '../FriendButton'

const Search = () => {
	const [openFriends, setOpenFriends] = useState(false)
	const [friend, setFriend] = useState({})
	const [username, setUsername] = useState('')
	const token = useSelector(getToken)
	const friends = useSelector(getFriends)

	const { isLoading, data, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ['searchUsers', username],
			queryFn: async ({ pageParam = 1 }) => {
				const response = await axios.get(
					`${process.env.MAIN_URL}/api/friends/search?limit=10&page=${pageParam}&username=${username}`,
					{
						headers: { Authorization: token }
					}
				)
				if (username.trim() === '') return []
				return response.data
			},
			initialPageParam: 1,
			enabled: !!username,
			getNextPageParam: (lastPage, allPages) => {
				return lastPage.length === 10 ? allPages.length + 1 : undefined
			},
			retry: 0
		})

	const handleChange = e => {
		setUsername(e.target.value)
		refetch()
	}

	const handleOpenDetails = friend => {
		setFriend(friend)
		setOpenFriends(true)
	}

	let content

	if (error) {
		content = <span className='cartoon-txt'>{error.message}</span>
	} else if (data?.pages?.length === 0) {
		content = <span className='cartoon2-txt'>Aucun résultat trouvé</span>
	} else {
		content = data?.pages.flatMap(page =>
			page.map(friend => {
				return !friends.map(user => user.id).includes(friend.id) ? (
					<FriendButton friend={friend} key={friend.id} onClick={handleOpenDetails} />
				) : null
			})
		)
	}

	return (
		<>
			<form className='search-form'>
				<motion.input
					initial={{ x: '100%', opacity: 0, scaleY: 0 }}
					animate={{ x: 0, opacity: 1, scaleY: 1 }}
					className='field shadowed search-input-field'
					type='text'
					placeholder='Ajouter un ami'
					value={username}
					onChange={handleChange}
				/>
			</form>

			<div className='friends-result-wrapper'>
				{content}
				<button
					onClick={() => fetchNextPage()}
					disabled={!hasNextPage || isFetchingNextPage}
					className={
						'friends-result-btn ' +
						(!hasNextPage || isFetchingNextPage
							? 'cartoon2-txt no-btn'
							: 'flat-btn ui-txt')
					}
				>
					<motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }}>
						{isFetchingNextPage ? (
							<Loader />
						) : hasNextPage ? (
							'Load More'
						) : (
							'Nothing more to load'
						)}
					</motion.div>
				</button>
				{isLoading && <Loader />}
			</div>
			<FriendDetails friend={friend} open={openFriends} setOpen={setOpenFriends} />
		</>
	)
}

export default Search
