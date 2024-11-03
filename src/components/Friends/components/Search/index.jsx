import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getFriends, getToken } from '../../../../app/selectors'
import axios from 'axios'
import Loader from '../../../Loader'
import FriendDetails from '../FriendDetails'

const Search = () => {
	const [openFriends, setOpenFriends] = useState(false)
	const [friend, setFriend] = useState({})
	const [username, setUsername] = useState('')
	const token = useSelector(getToken)
	const friends = useSelector(getFriends)

	const { isLoading, data, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
		queryKey: ['searchUsers', username],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await axios.get(
				`${process.env.REACT_APP_URL}/api/friends/search?limit=10&page=${pageParam}&username=${username}`,
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

	if (isLoading) {
		content = <Loader />
	} else if (error) {
		content = <span className='cartoon-txt'>{error.message}</span>
	} else if (data?.pages?.length === 0) {
		content = <span className='cartoon2-txt'>Aucun résultat trouvé</span>
	} else {
		content = data?.pages.flatMap(page =>
			page.map(friend => {
				return !friends.map(user => user.id).includes(friend.id) ? (
					<button
						key={friend.id}
						className='friend-fetched shadowed c-pointer no-btn'
						onClick={() => handleOpenDetails(friend)}
					>
						<span className='cartoon-short-txt'>{friend.username}</span>
						<span className='cartoon2-txt'>{friend.money}</span>
					</button>
				) : null
			})
		)
	}

	return (
		<>
			<form>
				<input
					className='field shadowed'
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
						(!hasNextPage || isFetchingNextPage ? 'cartoon2-txt no-btn' : 'flat-btn ui-txt')
					}
				>
					{isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
				</button>
			</div>
			<FriendDetails
				friend={friend}
				open={openFriends}
				setOpen={setOpenFriends}
			/>
		</>
	)
}

export default Search
