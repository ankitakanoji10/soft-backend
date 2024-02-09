const Project = require('../models/Project.js');
const slugify = require('slugify');
const fs = require('fs');
const User = require('../models/User.js');
const Help = require('../models/Help.js');
const cloudinary = require('../cloudinaryconfig.js');

const createProjectController = async (req, res) => {
  try {
    console.log(req.fields);
    const { name, description, links, techstacks, comments, rating} = req.fields;
    const { photo } = req.files;
    if (!req.user)
    {
      return res.status(401).send({
        success: false,
        message: "not authenticated",
        
    })
      }
    const user = await User.findById(req.user._id).select("-photo");
    if (!user)
    {
      return res.status(404).send({
        success: false,
        message: "Error user not found",
        
    })
    }
      //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      
      case photo && photo.size > 10000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 10mb" });
    }

    const project = new Project({ ...req.fields,owner:user.userid,slug: slugify(name, {lower:true}) });
    if (photo) {
        project.photo.data = fs.readFileSync(photo.path);
        project.photo.contentType = photo.type;
    }
    await project.save();
    // user.projects.push(project);
    // await user.save();
    await User.findByIdAndUpdate(user._id, {
      $push: { projects: project } 
    });
    res.status(201).send({
        success: true,
        message: "project created successfully",
        project,
        user
       
    })

  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error while updating product",
          error,
      })
  }
}
const getSingleProject = async (req, res) => {
  try {
    console.log(req.user);
        const project = await Project
          .findById(req.params.pid);
        res.status(200).send({
          success: true,
          message: "Single Project Fetched",
          project,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Eror while getitng single project",
          error,
        });
      }
}
const getPhotoController = async (req, res) => {
    try {
        
        const project = await Project.findById(req.params.pid).select("photo");
        if (project.photo.data) {
          res.set("Content-type", project.photo.contentType);
          return res.status(200).send(project.photo.data);
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Erorr while getting photo",
          error,
        });
      }
}
const editProjectController = async (req, res) => {
  try {
    const loggedin = req.user;
    if (!loggedin)
    {
      return res.status(401).send({
        success: false,
        message: "user not loggedin",
    });
    }
    const pro = await Project.findById(req.params.pid);
    if (pro.owner !== loggedin.userid)
    {
      return res.status(403).send({
        success: false,
        message: "forbidden access",
    });
    }
        const { name, description, links, techstacks, comments} = req.fields;
        // const { photo } = req.files;
      //alidation
        switch (true) {
            case !name:
            return res.status(500).send({ error: "Name is Required" });
            
            // case photo && photo.size > 1000000:
            // return res
            //     .status(500)
            //     .send({ error: "photo is Required and should be less then 1mb" });
        }
  
      const project = await Project.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
      // if (photo) {
      //   project.photo.data = fs.readFileSync(photo.path);
      //   project.photo.contentType = photo.type;
      // }
      await project.save();
      res.status(201).send({
        success: true,
        message: "Project Updated Successfully",
        project,
      });
    } catch (error) {
        console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while updating project",
        error,
      });
    }
    
}

const deleteProjectController = async (req, res) => {
  try {
    const loggedin = req.user;
    if (!loggedin)
    {
      return res.status(401).send({
        success: false,
        message: "user not loggedin",
    });
    }
    const pro = await Project.findById(req.params.pid);
    if (!pro)
    {
      return res.status(404).send({
        success: false,
        message: "project not found",
      })  
    }
    if (pro.owner !== loggedin.userid)
    {
      return res.status(403).send({
        success: false,
        message: "forbidden access",
    });
    }
        
    await Project.findByIdAndDelete(req.params.pid).select("-photo");
    await User.findByIdAndUpdate(loggedin._id, {
      $pull: { projects: req.params.pid } 
    });
        res.status(200).send({
          success: true,
          message: "Project Deleted successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error while deleting project",
          error,
        });
      }
    
}

const getRating = async (req, res) => {
  try {
    
      const project = await Project
          .findById(req.params.pid);
      const rating = project.rating;
      res.status(200).send({
        success: true,
        message: "Rating fetched",
        rating,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while getting rating",
        error,
      });
    }
  
}
const getComments = async (req, res) => {
  try {
      const project = await Project
          .findById(req.params.pid);
      const comment = project.comments;
      res.status(200).send({
        success: true,
        message: "Comment fetched",
        comment,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while getting comment",
        error,
      });
    }
  
}
const postRating = async (req, res) => {
  try {
      const { userrating } = req.body;
      const project = await Project
          .findById(req.params.pid);
      if (!project) {
          return res.status(404).send({
              success: false,
              message: "Project not found",
          });
      }
      project.cumulativeRating += parseInt(userrating);
      project.numberOfRatings += 1;
      console.log(project.cumulativeRating);
      console.log(project.numberOfRatings);
      project.rating = project.cumulativeRating / project.numberOfRatings;
    const rating = project.rating;
    console.log(rating);
      const updatedProject = await project.save();
      res.status(200).send({
        success: true,
        message: "rating updated",
        rating,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while updating rating",
        error,
      });
    }
}
const postComment = async (req, res) => {
  try {
    const comment  = req.body.comment;
    const user = req.user;
    if (!user)
    {
      return res.status(401).send({
        success: false,
        message: "User not found",
    });
    }
      const project = await Project
          .findById(req.params.pid);
      if (!project) {
          return res.status(404).send({
              success: false,
              message: "Project not found",
          });
      }
      project.comments.push(comment);
      const comments = project.comments;
      const updatedProject = await project.save();
      res.status(200).send({
        success: true,
        message: "Comment fetched",
        comments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while getting comment",
        error,
      });
    }
}
const getContributorController = async (req, res) => {
  try {
    const project = await Project
        .findById(req.params.pid);
    if (!project) {
        return res.status(404).send({
            success: false,
            message: "Project not found",
        });
    }
    const contributors = project.contributors;
    res.status(200).send({
      success: true,
      message: "Contributors fetched",
      contributors,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while adding contributor",
      error,
    });
  }
}
const addContributorController = async (req, res) => {
  try {
    const loggedin = req.user;
    if (!loggedin)
    {
      return res.status(401).send({
        success: false,
        message: "user not loggedin",
    });
    }
    const pro = await Project.findById(req.params.pid);
    if (pro.owner !== loggedin.userid)
    {
      return res.status(403).send({
        success: false,
        message: "forbidden access",
    });
    }
    const user = req.body;
    
    const project = await Project
        .findById(req.params.pid);
    if (!project) {
        return res.status(404).send({
            success: false,
            message: "Project not found",
        });
    }
    
    project.contributors.push(user);
    const updatedProject = await project.save();
    const updContributors = updatedProject.contributors;
    res.status(200).send({
      success: true,
      message: "Contributor added",
      updContributors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while adding contributor",
      error,
    });
  }
}
const getHelpController = async (req, res) => {
  try {
    // console.log(req.user);
    const project = await Project
      .findById(req.params.pid)
      .populate({
        path: 'askforhelp',
        populate: {
          path: 'user',
          model: 'User', 
        },
      });
    if (!project) {
        return res.status(404).send({
            success: false,
            message: "Project not found",
        });
    }
    // const obj = project.askforhelp;
    // const help = await Help.findById(obj._id).populate("user");
    const help = project.askforhelp;
    
    res.status(200).send({
      success: true,
      message: "ask for help fetched",
      help,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting ask for help",
      error,
    });
  }
}
const addHelpController = async (req, res) => {
  try {
    // console.log('req.user:', req.user); // Add this line for debugging
    console.log("add help called");
    const  comment  = req.body.comment;
    const user = req.user;
    if (!user)
    {
      return res.status(401).send({
        success: false,
        message: "user not autthenticated",
    });
    }
    const userFields = {
      _id: user._id,
      userid: user.userid,
      name: user.name,
      email: user.email,
      courses: user.courses,
      slug: user.slug,
      projects: user.projects,
      skills: user.skills,
  };
    const addhelp = new Help({user:{...userFields} , comment:comment});
    await addhelp.save();
    const project = await Project
        .findById(req.params.pid);
    if (!project) {
        return res.status(404).send({
            success: false,
            message: "Project not found",
        });
    }
    console.log("gotchaaa")
    project.askforhelp.push(addhelp);
    const help = await project.save();
    res.status(200).send({
      success: true,
      message: "ask for help addded",
      addhelp,
      userFields
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while adding ask for help",
      error,
    });
  }  
}
const addVideoController = async (req, res) => {
  try {
    const user = req.user;
    const project = await Project.findById(req.params.pid);
    
    if (!user || !project.owner ||user.userid !== project.owner)
    {
      return res.status(401).send({
        success: false,
        message:"user is not owner or not authenticated"
      })  
    }
    console.log(req.files);
    const {video} = req.files; // Assuming you're using a file upload middleware like multer
    if (!video)
    {
      return res.status(404).send({
        success: false,
        message:"no video"
        })
    }
    // Upload video to Cloudinary
    const result = await cloudinary.uploader.upload(video.path, { resource_type: 'video' });

    // Save Cloudinary URL or resource details to your MongoDB (project model)
    // Example: ProjectModel.findByIdAndUpdate(projectId, { $push: { videos: result.secure_url } });
    
    project.videos.push(result.secure_url);
    const modifiedProject = await project.save();
    res.status(200).send({ success: true, videoUrl: result.secure_url,modifiedProject });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: 'Internal Server Error in uploading video' });
  }
}
const getVideoController = async (req, res) => {
  try {
    const projectId = req.params.pid;

    // Retrieve all videos URLs from MongoDB
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send({ success: false, error: 'Project not found' });
    }

    const allVideos = project.videos; 

    res.status(200).send({ success: true, videos: allVideos });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
}
const getOwnerController = async (req, res) => {
  try {
    if (!req.user)
  {
    return res.status(401).send({
      success: false,
      message:"user not authenticated"
    })  
  }
  const user = req.user;
  const project = await Project.findById(req.params.pid);
  if (project.owner === user.userid)
  {
    return res.status(200).send({
      success: true,
      message:"user is the owner"
      })
  }
  else {
    return res.status(403).send({
      success: false,
      message:"user is not the owner"
      })
  }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
  
}
module.exports = {
    createProjectController,
    editProjectController, 
     
  deleteProjectController,
    getSingleProject,
  getPhotoController,
  getRating,
  getComments,
  postRating,
  postComment,
  addContributorController,
  getHelpController,
  addHelpController,
  addVideoController,
  getVideoController,
  getContributorController,
  getOwnerController
}