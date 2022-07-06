import React from 'react'
import { RichText } from 'prismic-reactjs'

const ContentSection = ({ slice }) => (
  <section>
    <RichText render={slice.primary.content} />
  </section>
)

export default ContentSection