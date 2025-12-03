import React, { useEffect, useState, useRef, useCallback } from 'react'
import Button from '../../components/common/Button/Button'
import Modal from '../../components/common/Modal/Modal'
import { initRevealAnimations } from '../../utils/helpers'
import { FiChevronLeft, FiChevronRight, FiDownload, FiShare2, FiX } from 'react-icons/fi'
import './Gallery.css'

// Image Imports (as provided in your snippet)
import img1 from "../../assets/gallery/img1.jpg"
import img2 from "../../assets/gallery/img2.jpg"
import img3 from "../../assets/gallery/img3.jpg"
import img4 from "../../assets/gallery/img4.jpg"
import img5 from "../../assets/gallery/img5.jpg"
import img6 from "../../assets/gallery/img6.jpg"
import img7 from "../../assets/gallery/img7.jpg"
import img8 from "../../assets/gallery/img8.jpg"
import img9 from "../../assets/gallery/img9.jpg"


const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loaded, setLoaded] = useState({})
  const modalRef = useRef(null)

  // ➡️ NEW: State and Data for Hero Slider
  const [heroSlideIndex, setHeroSlideIndex] = useState(0)

  const heroSlides = [
    { id: 1, image: '/images/projects/construction1.jpeg', alt: 'Residential Complex Construction', title: 'Residential Complex Construction' },
    { id: 2, image: '/images/projects/construction2.jpeg', alt: 'Commercial Building Development', title: 'Commercial Building Development' },
    { id: 3, image: '/images/projects/interior1.jpeg', title: 'Luxury Villa Interior', alt: 'Luxury Villa Interior' },
    { id: 4, image: '/images/projects/interior2.jpeg', title: 'Modern Office Space', alt: 'Modern Office Space' },
    // Placeholder titles/alts added for imported images
    { id: 5, image: img1, alt: 'Skyscraper Interior Framing', title: 'Skyscraper Framing' },
    { id: 6, image: img2, alt: 'Modern Office Lobby', title: 'Modern Office Lobby' },
    { id: 7, image: img3, alt: 'Residential Exterior View', title: 'Residential Exterior' },
    
    { id: 10, image: img6, alt: 'Commercial Glass Facade', title: 'Commercial Glass Facade' },
    { id: 11, image: img7, alt: 'Warehouse Development', title: 'Warehouse Development' },
    { id: 12, image: img8, alt: 'Minimalist Apartment Interior', title: 'Minimalist Apartment Interior' },
    { id: 13, image: img9, alt: 'Project Launch Event', title: 'Project Launch Event' },
  ]
  // END NEW HERO SLIDER DATA

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'construction', name: 'Construction' },
    { id: 'interior', name: 'Interior Design' },
    { id: 'projects', name: 'Projects' },
    { id: 'events', name: 'Events' }
  ]

  const galleryItems = [
    { id: 1, category: 'construction', image: '/images/projects/construction1.jpeg', title: 'Residential Complex', description: 'Modern apartment complex with sustainable design' },
    { id: 2, category: 'construction', image: '/images/projects/construction2.jpeg', title: 'Commercial Building', description: 'State-of-the-art commercial space development' },
    { id: 3, category: 'interior', image: '/images/projects/interior1.jpeg', title: 'Luxury Villa Interior', description: 'Premium interior design for residential villa' },
    { id: 4, category: 'interior', image: '/images/projects/interior2.jpeg', title: 'Office Space Design', description: 'Modern workspace interior design' },
    
    // Placeholder Titles/Descriptions/Categories added for imported images
    { id: 5, category: 'projects', image: img1, title: 'Skyscraper Framing', description: 'Initial structural work for a new tower.' },
    { id: 6, category: 'interior', image: img2, title: 'Modern Office Lobby', description: 'Sleek, professional lobby design.' },
    { id: 7, category: 'construction', image: img3, title: 'Residential Exterior View', description: 'Completed exterior of a modern home.' },
    { id: 8, category: 'projects', image: img4, title: 'Industrial Site Overview', description: 'Large scale industrial complex construction.' },
    { id: 9, category: 'projects', image: img5, title: 'High-Rise Construction', description: 'Building the next urban landmark.' },
    { id: 10, category: 'projects', image: img6, title: 'Commercial Glass Facade', description: 'Modern, energy-efficient glass facade installation.' },
    { id: 11, category: 'construction', image: img7, title: 'Warehouse Development', description: 'Logistics and storage facility construction.' },
    { id: 12, category: 'interior', image: img8, title: 'Minimalist Apartment Interior', description: 'Clean lines and modern furniture.' },
    { id: 13, category: 'events', image: img9, title: 'Project Launch Event', description: 'Official launch of a major new project.' },
    
    // Re-indexed existing items to avoid conflict
    { id: 14, category: 'events', image: '/images/projects/project4.jpeg', title: 'Corporate Event', description: 'Premium transportation for corporate gathering' },
    { id: 15, category: 'events', image: '/images/projects/project5.jpeg', title: 'VIP Movement', description: 'Luxury travel solutions for VIP clients' }
  ]

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory)

  useEffect(() => {
    initRevealAnimations()
    window.scrollTo(0, 0)
  }, [])

  const handleImgLoad = (id) => {
    setLoaded(prev => ({ ...prev, [id]: true }))
  }

  // ➡️ Slider Navigation Function
  const navigateHeroSlide = useCallback((direction) => {
    setHeroSlideIndex(prevIndex => {
      const len = heroSlides.length
      if (direction === 'next') {
        return (prevIndex + 1) % len
      } else {
        return (prevIndex - 1 + len) % len
      }
    })
  }, [heroSlides.length])

  // ➡️ Auto-advance for Hero Slider
  useEffect(() => {
    const interval = setInterval(() => {
      navigateHeroSlide('next')
    }, 5000) // Change slide every 5 seconds
    return () => clearInterval(interval)
  }, [navigateHeroSlide])
  // END NEW HERO SLIDER LOGIC

  const openModal = (item) => {
    setSelectedImage(item)
    setIsModalOpen(true)
    preloadNeighborImages(item.id)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  const findIndex = (id) => galleryItems.findIndex(i => i.id === id)

  const navigateImage = (direction) => {
    if (!selectedImage) return
    const idx = findIndex(selectedImage.id)
    let newIndex = idx

    if (direction === 'next') newIndex = (idx + 1) % galleryItems.length
    else newIndex = (idx - 1 + galleryItems.length) % galleryItems.length

    const newItem = galleryItems[newIndex]
    setSelectedImage(newItem)
    preloadNeighborImages(newItem.id)
  }

  const preloadNeighborImages = (id) => {
    const idx = findIndex(id)
    const prev = galleryItems[(idx - 1 + galleryItems.length) % galleryItems.length]
    const next = galleryItems[(idx + 1) % galleryItems.length]

    ;[prev, next].forEach(item => {
      const img = new Image()
      img.src = item.image
    })
  }

  useEffect(() => {
    if (!isModalOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft') navigateImage('prev')
      if (e.key === 'ArrowRight') navigateImage('next')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isModalOpen, selectedImage, navigateImage]) // Added navigateImage dependency

  const handleShare = async () => {
    if (!selectedImage) return
    const shareData = {
      title: selectedImage.title,
      text: selectedImage.description,
      url: window.location.origin + selectedImage.image
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        alert('Image link copied to clipboard')
      }
    } catch (err) {
      console.warn('Share failed', err)
    }
  }

  const handleDownload = () => {
    if (!selectedImage) return
    const a = document.createElement('a')
    a.href = selectedImage.image
    a.download = selectedImage.title.replace(/\s+/g, '_') + '.jpg'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const revealDelay = (index) => ({ style: { animationDelay: `${index * 60}ms` } })

  return (
    <div className="gallery-page">

      {/* HERO SECTION - RESTRUCTURED */}
      <section className="gallery-hero premium-hero">
        <div className="container gallery-hero-container">
          
          {/* ➡️ Hero Image Slider (Left Side) */}
          <div className="hero-slider-wrapper">
            <div className="hero-image-slider">
              {heroSlides.map((slide, index) => (
                <div 
                  key={slide.id} 
                  className={`hero-slide ${index === heroSlideIndex ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${slide.image})` }} // Use CSS background for cover effect
                >
                  {/* The image is rendered via CSS background for better control */}
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button className="slider-nav prev" onClick={() => navigateHeroSlide('prev')}>
              <FiChevronLeft />
            </button>
            <button className="slider-nav next" onClick={() => navigateHeroSlide('next')}>
              <FiChevronRight />
            </button>

            {/* Dots Indicator */}
            <div className="slider-dots">
              {heroSlides.map((_, index) => (
                <span 
                  key={index}
                  className={`dot ${index === heroSlideIndex ? 'active' : ''}`}
                  onClick={() => setHeroSlideIndex(index)}
                />
              ))}
            </div>
          </div>


          {/* Hero Content (Right Side) */}
          <div className="gallery-hero-content">
            <h1 className="gallery-hero-title">Project Gallery</h1> {/* Updated Title to match image */}
            <p className="gallery-hero-subtitle">
            Explore our portfolio of successful projects and innovative solutions{/* Updated Subtitle to match image */}
            </p>

            <div className="gallery-hero-actions">
              {/* Button 1: Learn More About Us (Primary Button - Re-added) */}
              {/* <Button
                variant="primary"
                size="large"
                className="btn-learn-more"
                onClick={() => console.log('Learn More About Us clicked')}
              >
                Learn More About Us <FiChevronRight style={{ marginLeft: '8px' }}/>
              </Button> */}

              {/* Button 2: View Our Projects (Secondary Button) */}
              <Button
                variant="secondary"
                size="large"
                className="btn-view-projects"
                onClick={() =>
                  document.getElementById('gallery-grid').scrollIntoView({ behavior: 'smooth' })
                }
              >
                View Our Projects
              </Button>
            </div>
          </div>
        </div>
        {/* The original gallery-hero-overlay is now removed/redundant */}
      </section>

      {/* FILTER SECTION */}
      <section className="gallery-filter-section section">
        <div className="container">
          <div className="filter-tabs reveal">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div id="gallery-grid" className="gallery-grid">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                // Removed redundant 'loaded' check from className to rely only on reveal animation
                className={`gallery-item reveal`} 
                {...revealDelay(index)}
                onClick={() => openModal(item)}
              >
                <div className="image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => (e.target.src = '/images/multi.jpeg')}
                    onLoad={() => handleImgLoad(item.id)}
                  />
                </div>
                {/* Updated info block structure to match previous CSS needs */}
                <div className="item-info">
                  <h4 className="item-title">{item.title}</h4>
                  <p className="item-category">{categories.find(c => c.id === item.category)?.name}</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="no-results text-center">
              <h3>No projects found in this category</h3>
              <p>Please select a different category.</p>
              <Button variant="primary" onClick={() => setSelectedCategory('all')}>
                View All Projects
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="gallery-stats section">
        <div className="container">
          <h2 className="section-title reveal">Our Impact by the Numbers</h2>
          <div className="stats-grid reveal">
            <div className="stat-item">
              <div className="stat-number">250+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5</div>
              <div className="stat-label">Industry Awards</div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedImage?.title}>
        {selectedImage && (
          <div className="image-modal-content" ref={modalRef}>
            <div className="modal-image-row">
              <button className="modal-nav modal-prev" onClick={() => navigateImage('prev')}>
                <FiChevronLeft />
              </button>

              <div className="modal-image-wrapper">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  onError={(e) => (e.target.src = '/images/multi.jpeg')}
                />
              </div>

              <button className="modal-nav modal-next" onClick={() => navigateImage('next')}>
                <FiChevronRight />
              </button>
            </div>

            <div className="modal-details">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>

              <div className="modal-actions">
                <button className="modal-action" onClick={handleDownload}><FiDownload /> Download</button>
                <button className="modal-action" onClick={handleShare}><FiShare2 /> Share</button>
                {/* <button className="modal-close" onClick={closeModal}><FiX /></button> */}
              </div>

              <div className="modal-tags">
                <span className="modal-tag">{selectedImage.category}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Gallery