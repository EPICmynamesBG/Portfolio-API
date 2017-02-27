-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Feb 27, 2017 at 04:28 AM
-- Server version: 5.5.42
-- PHP Version: 7.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portfolio`
--
CREATE DATABASE IF NOT EXISTS `portfolio` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `portfolio`;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(300) NOT NULL,
  `password` varchar(500) NOT NULL,
  `token` longtext
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `token`) VALUES
(1, 'Brandon Groff', 'mynamesbg@gmail.com', '$2y$11$bda3900d8f586afec46e0eSU3XLcyZqp4lyAT3WatWGkhYRWNJSoO', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(300) NOT NULL,
  `url` varchar(500) NOT NULL,
  `label` varchar(300) DEFAULT NULL,
  `alt` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `interests`
--

CREATE TABLE `interests` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `projectImages`
--

CREATE TABLE `projectImages` (
  `id` int(10) unsigned NOT NULL,
  `imageId` int(10) unsigned NOT NULL,
  `projectId` int(10) unsigned NOT NULL,
  `orderNum` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT 'the order of this image in the project''s carousel'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(10) unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `linkText` varchar(300) DEFAULT NULL,
  `linkImageId` int(10) unsigned DEFAULT NULL COMMENT 'an image object',
  `linkLocation` varchar(1000) DEFAULT NULL COMMENT 'the link href',
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `status` varchar(500) DEFAULT NULL COMMENT 'completion status',
  `description` text,
  `hidden` tinyint(1) NOT NULL DEFAULT '1',
  `lastUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `projectTags`
--

CREATE TABLE `projectTags` (
  `id` int(10) unsigned NOT NULL,
  `tagId` int(10) unsigned NOT NULL,
  `projectId` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `workContacts`
--

CREATE TABLE `workContacts` (
  `id` int(10) unsigned NOT NULL,
  `contactId` int(10) unsigned NOT NULL,
  `workExperienceId` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `workExperience`
--

CREATE TABLE `workExperience` (
  `id` int(10) unsigned NOT NULL,
  `mdiIcon` varchar(50) DEFAULT NULL COMMENT 'icon code from mdi-icons',
  `title` varchar(200) NOT NULL,
  `company` varchar(500) NOT NULL,
  `location` varchar(500) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL COMMENT 'null = still working',
  `description` text NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '1',
  `lastUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `workTags`
--

CREATE TABLE `workTags` (
  `id` int(10) unsigned NOT NULL,
  `tagId` int(10) unsigned NOT NULL,
  `workExperienceId` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `interests`
--
ALTER TABLE `interests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projectImages`
--
ALTER TABLE `projectImages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_images_projId` (`projectId`),
  ADD KEY `fk_image_imageId` (`imageId`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_proj_linkImage` (`linkImageId`);

--
-- Indexes for table `projectTags`
--
ALTER TABLE `projectTags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tags_projTags` (`tagId`),
  ADD KEY `fk_proj_projId` (`projectId`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workContacts`
--
ALTER TABLE `workContacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_work_workId` (`workExperienceId`),
  ADD KEY `fk_contact_contactId` (`contactId`);

--
-- Indexes for table `workExperience`
--
ALTER TABLE `workExperience`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workTags`
--
ALTER TABLE `workTags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tag_tagId` (`tagId`),
  ADD KEY `fk_tag_workExpId` (`workExperienceId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `interests`
--
ALTER TABLE `interests`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `projectImages`
--
ALTER TABLE `projectImages`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `projectTags`
--
ALTER TABLE `projectTags`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `workContacts`
--
ALTER TABLE `workContacts`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `workExperience`
--
ALTER TABLE `workExperience`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `workTags`
--
ALTER TABLE `workTags`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `projectImages`
--
ALTER TABLE `projectImages`
  ADD CONSTRAINT `fk_images_projId` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `fk_image_imageId` FOREIGN KEY (`imageId`) REFERENCES `images` (`id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `fk_proj_linkImage` FOREIGN KEY (`linkImageId`) REFERENCES `images` (`id`);

--
-- Constraints for table `projectTags`
--
ALTER TABLE `projectTags`
  ADD CONSTRAINT `fk_proj_projId` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `fk_tags_projTags` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`);

--
-- Constraints for table `workContacts`
--
ALTER TABLE `workContacts`
  ADD CONSTRAINT `fk_contact_contactId` FOREIGN KEY (`contactId`) REFERENCES `contacts` (`id`),
  ADD CONSTRAINT `fk_work_workId` FOREIGN KEY (`workExperienceId`) REFERENCES `workExperience` (`id`);

--
-- Constraints for table `workTags`
--
ALTER TABLE `workTags`
  ADD CONSTRAINT `fk_tag_tagId` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`),
  ADD CONSTRAINT `fk_tag_workExpId` FOREIGN KEY (`workExperienceId`) REFERENCES `workExperience` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
