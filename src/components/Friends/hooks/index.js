import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { FriendsSlice } from "../FriendsSlice"
import { useDispatch, useSelector } from "react-redux"
import { getToken } from "../../../app/selectors"

const axiosAddFriend = async ({ id, token }) => {
	return axios.post(process.env.REACT_APP_URL + '/api/friends/add', { idFriend: id }, 
		{
			headers: {
				Authorization: token
			}
		})
	.then(response => response.data)
	.catch(error => {
		console.log(error);
	})
}

export const useAddFriend = () => {
	const token = useSelector(getToken)
	const dispatch = useDispatch()

	const mutation = useMutation({
		mutationFn: axiosAddFriend,
		onSuccess: (data) => {
			dispatch(FriendsSlice.actions.add(data))
		}
	})

	const addFriend = (id) => {
		mutation.mutate({ id: id, token: token })
	}

	return {
		addFriend,
		...mutation
	}
}


const axiosRemoveFriend = async ({ friend, token }) => {
	return axios.delete(`${process.env.REACT_APP_URL}/api/friends/remove`, {
		headers: { Authorization: token },
		data: { idFriend: friend.id }
	})
	.then(response => friend)
	.catch(error => {
		throw new Error('Erreur lors de la suppression de votre ami')
	})
}

export const useRemoveFriend = () => {
	const token = useSelector(getToken)
	const dispatch = useDispatch()

    const mutation = useMutation({
		mutationFn: axiosRemoveFriend,
		onSuccess: (data) => {
			dispatch(FriendsSlice.actions.remove(data))
		}
	})

	const removeFriend = (friend) => {
        mutation.mutate({ friend: friend, token: token })
    }

	return {
        removeFriend,
        ...mutation
    }
}