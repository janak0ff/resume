type Profile = {
  name: string;
  headline: string;
  location?: string | null;
  phone?: string | null;
  email: string;
  website?: string | null;
  summary: string;
  avatarUrl?: string | null;
  links: { id: string; label: string; url: string }[];
  experiences: {
    id: string;
    company: string;
    role: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    bullets: string[];
  }[];
  projects: {
    id: string;
    name: string;
    url?: string | null;
    description: string;
    bullets: string[];
  }[];
  educations: {
    id: string;
    institution: string;
    degree: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    details?: string | null;
  }[];
  certifications: { id: string; title: string; issuer: string; url?: string | null }[];
  skills: { id: string; name: string }[];
};

export function ResumeView({ profile }: { profile: Profile }) {
  const contact = [profile.location, profile.phone, profile.email].filter(Boolean);

  return (
    <div className="resume">
      <header className="resume-header">
        <img
          src={profile.avatarUrl || '/janak-resume.jpg'}
          alt={profile.name}
          className="profile-pic"
        />
        <div className="header-content">
          <h1>{profile.name}</h1>
          <p className="headline">{profile.headline}</p>
          <div className="contact-info">
            {contact.map((item) => (
              <span className="contact-item" key={item}>
                {item === profile.email ? (
                  <a href={`mailto:${item}`}>{item}</a>
                ) : (
                  item
                )}
              </span>
            ))}
            {profile.website && (
              <span className="contact-item">
                <a href={profile.website} target="_blank" rel="noreferrer">
                  Portfolio Website
                </a>
              </span>
            )}
          </div>
          {profile.links.length > 0 && (
            <div className="profile-links">
              {profile.links.map((link) => (
                <a href={link.url} key={link.id} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="resume-main">
        <section className="summary-section" aria-label="Summary">
          <p className="summary">{profile.summary}</p>
        </section>

        {(profile.experiences.length > 0 || profile.projects.length > 0) && (
          <section aria-label="Projects and Experience">
            <SectionTitle>Projects &amp; Experience</SectionTitle>
            {profile.experiences.length > 0 && (
              <>
                <SubsectionTitle>Experience</SubsectionTitle>
                {profile.experiences.map((experience) => (
                  <Entry key={experience.id}>
                    <EntryHeader
                      title={experience.company}
                      meta={[experience.location, `${experience.startDate} — ${experience.endDate || 'Present'}`]
                        .filter(Boolean)
                        .join(' • ')}
                    />
                    <p className="role-title">{experience.role}</p>
                    <BulletList items={experience.bullets} />
                  </Entry>
                ))}
              </>
            )}
            {profile.projects.length > 0 && (
              <>
                <SubsectionTitle>Projects</SubsectionTitle>
                {profile.projects.map((project) => (
                  <Entry key={project.id}>
                    <EntryHeader
                      title={project.name}
                      link={project.url ? { label: 'Project Link', url: project.url } : undefined}
                    />
                    {project.description && <p className="entry-description">{project.description}</p>}
                    <BulletList items={project.bullets} />
                  </Entry>
                ))}
              </>
            )}
          </section>
        )}

        {profile.educations.length > 0 && (
          <section aria-label="Education">
            <SectionTitle>Education</SectionTitle>
            {profile.educations.map((education) => (
              <Entry key={education.id}>
                <EntryHeader
                  title={education.institution}
                  meta={[education.location, `${education.startDate} — ${education.endDate || 'Present'}`]
                    .filter(Boolean)
                    .join(' • ')}
                />
                <p className="role-title">{education.degree}</p>
                {education.details && <p className="entry-description">{education.details}</p>}
              </Entry>
            ))}
          </section>
        )}

        {profile.certifications.length > 0 && (
          <section aria-label="Certifications">
            <SectionTitle>Certifications &amp; Badges</SectionTitle>
            <div className="certifications-grid">
              {profile.certifications.map((certification) => {
                const content = (
                  <>
                    <span className="cert-icon" aria-hidden="true">✓</span>
                    <span className="cert-content">
                      <strong>{certification.title}</strong>
                      <span>{certification.issuer}</span>
                    </span>
                    {certification.url && <span className="cert-arrow" aria-hidden="true">›</span>}
                  </>
                );
                return certification.url ? (
                  <a className="cert-item" href={certification.url} key={certification.id} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <div className="cert-item" key={certification.id}>{content}</div>
                );
              })}
            </div>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section aria-label="IT Skills">
            <SectionTitle>IT Skills</SectionTitle>
            <div className="skill-list">
              {profile.skills.map((skill) => <span className="skill-tag" key={skill.id}>{skill.name}</span>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2>{children}</h2>;
}

function SubsectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="subsection-title"><span>{children}</span></h3>;
}

function Entry({ children }: { children: React.ReactNode }) {
  return <article className="resume-entry">{children}</article>;
}

function EntryHeader({
  title,
  meta,
  link,
}: {
  title: string;
  meta?: string;
  link?: { label: string; url: string };
}) {
  return (
    <div className="item-header">
      <strong className="org-name">{title}</strong>
      {link ? (
        <a className="project-link" href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
      ) : (
        meta && <span className="date-range">{meta}</span>
      )}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="details">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}
