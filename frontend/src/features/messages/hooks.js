import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { getToken } from '@redux/selectors'

const axiosSendMessage = async (token, friendUsername, message) => {
	return axios
		.post(
			process.env.MAIN_URL + '/api/friends/send_message/' + friendUsername,
			{ message },
			{ headers: { Authorization: token } }
		)
		.then(response => response.data)
		.catch(err => {
			throw new Error(err.message)
		})
}

export const useSendMessage = () => {
	const token = useSelector(getToken)

	const mutation = useMutation({
		mutationFn: ({ friendUsername, message }) =>
			axiosSendMessage(token, friendUsername, message)
	})

	const sendMessage = (friendUsername, message) => {
		return mutation.mutateAsync({ friendUsername, message })
	}

	return { sendMessage, ...mutation }
}

const axiosDeleteMessage = async (token, messageId) => {
	return axios
		.delete(process.env.MAIN_URL + '/api/friends/delete_message/' + messageId, {
			headers: { Authorization: token }
		})
		.then(response => response.data)
		.catch(err => {
			throw new Error(err.message)
		})
}

export const useDeleteMessage = () => {
	const token = useSelector(getToken)

	const mutation = useMutation({
		mutationFn: messageId => axiosDeleteMessage(token, messageId)
	})

	const deleteMessage = messageId => {
		mutation.mutate(messageId)
	}

	return { deleteMessage, ...mutation }
}

const axiosGetConversation = async (token, friendUsername, page) => {
	if (page == undefined) {
		return []
	}

	return axios
		.post(
			process.env.MAIN_URL + '/api/friends/get_conversation/' + friendUsername,
			{ page, limit: 10 },
			{ headers: { Authorization: token } }
		)
		.then(response => response.data)
		.catch(err => {
			throw new Error(err.message)
		})
}

export const useGetConversation = friendUsername => {
	const token = useSelector(getToken)

	const infiniteQuery = useInfiniteQuery({
		queryKey: ['searchUsers', friendUsername],
		queryFn: async ({ pageParam = 1 }) =>
			axiosGetConversation(token, friendUsername, pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === 10 ? allPages.length + 1 : undefined
		},
		retry: 0
	})

	return infiniteQuery
}

const axiosSeeMessage = async (token, messageId) => {
	return axios
		.put(
			process.env.MAIN_URL + '/api/friends/see_message/' + messageId,
			{},
			{ headers: { Authorization: token } }
		)
		.then(response => response.data)
		.catch(err => {
			throw new Error(err.message)
		})
}

export const useSeeMessage = () => {
	const token = useSelector(getToken)

	const mutation = useMutation({
		mutationFn: messageId => axiosSeeMessage(token, messageId)
	})

	const seeMessage = messageId => {
		mutation.mutate(messageId)
	}

	return { seeMessage, ...mutation }
}

const axiosSeeConversation = async (token, friendUsername) => {
	return axios
		.put(
			process.env.MAIN_URL + '/api/friends/see_conversation/' + friendUsername,
			{},
			{ headers: { Authorization: token } }
		)
		.then(response => response.data)
		.catch(err => {
			throw new Error(err.message)
		})
}

export const useSeeConversation = () => {
	const token = useSelector(getToken)

	const mutation = useMutation({
		mutationFn: friendUsername => axiosSeeConversation(token, friendUsername)
	})

	const seeConversation = friendUsername => {
		mutation.mutate(friendUsername)
	}

	return { seeConversation, ...mutation }
}
