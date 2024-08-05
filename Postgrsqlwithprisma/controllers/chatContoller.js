import { prisma } from "../dataBase/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new ApiError(400, "Please send userId");
    }
    if (req.user.id == userId) {
      throw new ApiError(400, "Please provide a different id");
    }

    // Find the current user with their chats and the users in those chats
    let user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        chats: {
          include: {
            users: {
              select: {
                id: true,
                email: true,
                name: true,
                image: true,
              },
            },
            message: {
              include: {
                sender: true,
              },
            },
          },
        },
      },
    });

    // console.log("user **********", user);

    // Filter the user's chats to find a chat that includes the provided userId
    const userInchat = user.chats.filter((chat) => {
      return chat.users.some((user) => user.id === userId);
    });

    if (userInchat.length > 0) {
      res.status(200).json(new ApiResponse(200, user.chats, "Chats fetched"));
    } else {
      // Create a new chat if no existing chat is found
      const newChat = await prisma.chat.create({
        data: {
          chatName: "sender",
          isGroupChat: false,
          users: {
            connect: [{ id: req.user.id }, { id: userId }],
          },
        },
        include: {
          users: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
          message: true,
          latestMessage: true,
        },
      });
      res.status(201).json(new ApiResponse(201, newChat, "Chat created"));
    }
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const createGroupChat = async (req, res) => {
  const { users, groupName } = req.body;
  try {
    if (!users || !groupName) {
      throw new ApiError(400, "please provide group name and list of user");
    }

    if (users.length < 2) {
      throw new ApiError(
        400,
        "More than 2 users are required to form a group chat"
      );
    }
   users.push(req.user.id);
   const groupUsers=users.map((element)=>{
    return {
      id:element
    }
   })
   const groupChat = await prisma.chat.create({
    data: {
      chatName: groupName,
      isGroupChat: true,
      users: {
        connect: groupUsers,
      },
      groupAdminId: req.user.id
    },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
      message: true,
      latestMessage: true,
      groupAdmin:{
        select:{
          id: true,
          email: true,
          name: true,
          image: true,
        }
      }
    },
  });
  res.status(201).json(new ApiResponse(201, groupChat, "Group Chat created"));

  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const allChatsOfLoginedUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    // console.log(req.user)
    if (!userId) {
      throw new ApiError(400, "Please send userId");
    }
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        message: {
          include: {
            sender: true,
          },
        },
        latestMessage: true,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, chats, "All chats of logged-in user"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export { accessChat, allChatsOfLoginedUser ,createGroupChat};