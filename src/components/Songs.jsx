import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { supabase } from '../lib/supabase'

const SongsContainer = styled.main`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 28px 18px 32px;
  display: grid;
  gap: 28px;
`

const PageHeader = styled.div`
  display: grid;
  gap: 12px;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(2.25rem, 3.3vw, 3.6rem);
  line-height: 0.98;
  letter-spacing: -0.07em;
  color: #FF6A00;
  text-shadow: 0 0 15px rgba(255, 106, 0, 0.3);
`

const PageSubtitle = styled.p`
  margin: 0;
  color: #7a8088;
  font-size: 1rem;
  max-width: 740px;
  letter-spacing: 0.5px;
`

const ControlsSection = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr auto;
  align-items: end;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #2E3B2F;
  border-left: 3px solid #FF6A00;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.9);
  color: #FF6A00;
  font-size: 1rem;
  transition: all 0.2s linear;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;

  &::placeholder {
    color: #7a8088;
    text-transform: uppercase;
  }

  &:focus {
    outline: none;
    border-color: #FF6A00;
    background: rgba(11, 15, 20, 0.95);
    box-shadow: 0 0 12px rgba(255, 106, 0, 0.2);
  }
`

const AddButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #FF6A00, #E55A00);
  border: none;
  border-radius: 0;
  color: #0B0F14;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s linear;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0 15px rgba(255, 106, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(255, 106, 0, 0.5);
    background: linear-gradient(135deg, #FF7A20, #FF6A00);
  }

  &:active {
    transform: translateY(0);
  }
`

const CategoryFilter = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`

const CategoryTag = styled.button`
  padding: 6px 14px;
  border: 1px solid ${(props) => (props.active ? '#FF6A00' : '#2E3B2F')};
  border-radius: 0;
  background: ${(props) => (props.active ? 'rgba(255, 106, 0, 0.2)' : 'transparent')};
  color: ${(props) => (props.active ? '#FF6A00' : '#7a8088')};
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s linear;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;

  &:hover {
    border-color: #FF6A00;
    color: #FF6A00;
    box-shadow: 0 0 8px rgba(255, 106, 0, 0.2);
  }
`

const SongsGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const SongCard = styled.div`
  padding: 24px;
  border: 2px solid #FF6A00;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.95);
  display: grid;
  gap: 16px;
  transition: all 0.2s linear;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 106, 0, 0.15);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #FF6A00, transparent);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 50px rgba(255, 106, 0, 0.3), inset 0 1px 0 rgba(255, 106, 0, 0.1);
    border-color: #FF7A20;
  }
`

const SongTitle = styled.h3`
  margin: 0;
  color: #FF6A00;
  font-size: 1.3rem;
  letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(255, 106, 0, 0.2);
  text-transform: uppercase;
`

const SongMeta = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: #7a8088;
`

const MetaItem = styled.span`
  display: flex;
  gap: 4px;

  strong {
    color: #FF6A00;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`

const LyricsPreview = styled.div`
  max-height: 200px;
  overflow-y: auto;
  padding: 12px;
  background: rgba(46, 59, 45, 0.15);
  border-radius: 0;
  border-left: 3px solid #FF6A00;
  color: #E8EAED;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 106, 0, 0.05);
    border-radius: 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #FF6A00;
    border-radius: 0;

    &:hover {
      background: #FF7A20;
    }
  }
`

const SongActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const ActionButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${(props) => (props.primary ? '#FF6A00' : '#2E3B2F')};
  border-radius: 0;
  background: ${(props) => (props.primary ? 'rgba(255, 106, 0, 0.15)' : 'transparent')};
  color: ${(props) => (props.primary ? '#FF6A00' : '#7a8088')};
  cursor: pointer;
  transition: all 0.2s linear;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover {
    background: rgba(255, 106, 0, 0.25);
    border-color: #FF6A00;
    color: #FF6A00;
    box-shadow: 0 0 10px rgba(255, 106, 0, 0.2);
    transform: translateY(-1px);
  }
`

const DeleteButton = styled.button`
  padding: 10px 16px;
  border: 1px solid #D72638;
  border-radius: 0;
  background: transparent;
  color: #D72638;
  cursor: pointer;
  transition: all 0.2s linear;
  font-weight: 600;
  font-size: 0.9rem;
  grid-column: 1 / -1;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover {
    background: rgba(215, 38, 56, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 0 10px rgba(215, 38, 56, 0.2);
  }
`

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;

  @media (max-width: 720px) {
    padding: 16px;
  }
`

const Modal = styled.div`
  background: #0B0F14;
  border: 2px solid #FF6A00;
  border-radius: 0;
  padding: 28px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 106, 0, 0.2);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #FF6A00, transparent);
  }

  @media (max-width: 720px) {
    padding: 20px;
  }
`

const ModalTitle = styled.h2`
  margin: 0 0 20px;
  color: #FF6A00;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(255, 106, 0, 0.2);
  text-transform: uppercase;
`

const FormGroup = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
`

const Label = styled.label`
  color: #FF6A00;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #2E3B2F;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.9);
  color: #E8EAED;
  font-size: 0.95rem;
  transition: all 0.2s linear;

  &::placeholder {
    color: #7a8088;
  }

  &:focus {
    outline: none;
    border-color: #FF6A00;
    box-shadow: 0 0 8px rgba(255, 106, 0, 0.2);
  }
`

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #2E3B2F;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.9);
  color: #E8EAED;
  font-size: 0.95rem;
  transition: all 0.2s linear;

  option {
    background: #0B0F14;
    color: #E8EAED;
  }

  &:focus {
    outline: none;
    border-color: #FF6A00;
    box-shadow: 0 0 8px rgba(255, 106, 0, 0.2);
  }
`

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #2E3B2F;
  border-radius: 0;
  background: rgba(11, 15, 20, 0.9);
  color: #E8EAED;
  font-size: 0.95rem;
  font-family: 'Courier New', monospace;
  resize: vertical;
  min-height: 200px;
  transition: all 0.2s linear;

  &::placeholder {
    color: #7a8088;
  }

  &:focus {
    outline: none;
    border-color: #FF6A00;
    box-shadow: 0 0 8px rgba(255, 106, 0, 0.2);
  }
`

const ModalActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
`

const ModalButton = styled.button`
  padding: 12px 20px;
  border: 1px solid ${(props) => (props.cancel ? '#E8EAED' : '#FF6A00')};
  border-radius: 0;
  background: ${(props) => (props.cancel ? 'transparent' : 'rgba(255, 106, 0, 0.15)')};
  color: ${(props) => (props.cancel ? '#E8EAED' : '#FF6A00')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s linear;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover {
    background: ${(props) => (props.cancel ? 'rgba(232, 234, 237, 0.1)' : 'rgba(255, 106, 0, 0.25)')};
    transform: translateY(-1px);
    box-shadow: ${(props) => (props.cancel ? 'none' : '0 0 10px rgba(255, 106, 0, 0.2)')};
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7a8088;
  border: 1px dashed #2E3B2F;
  border-left: 3px dashed #FF6A00;
  background: rgba(11, 15, 20, 0.5);
  border-radius: 0;
  letter-spacing: 0.3px;
`

const categories = [
  'Canções do Exército',
  'Canções do CFC',
  'Hinos',
  'Canções de Marcha',
  'Canções Motivacionais'
]

export default function Songs() {
  const [songs, setSongs] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', category: categories[0], lyrics: '' })
  const [isLoadingData, setIsLoadingData] = useState(true)

  const fetchSongs = async () => {
    try {
      setIsLoadingData(true)
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        alert('Erro ao buscar canções: ' + error.message)
        return
      }

      setSongs(data || [])
    } catch (error) {
      console.error('Erro ao buscar canções:', error)
      alert('Erro ao buscar canções: ' + error.message)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.lyrics.trim()) {
      alert('Preencha todos os campos')
      return
    }

    try {
      const { error } = await supabase
        .from('songs')
        .insert([
          {
            title: formData.title,
            category: formData.category,
            lyrics: formData.lyrics,
            artist: 'CFC 2026'
          }
        ])

      if (error) {
        console.error('Supabase error:', error)
        alert('Erro ao adicionar canção: ' + error.message)
        return
      }

      await fetchSongs()
      setFormData({ title: '', category: categories[0], lyrics: '' })
      setShowModal(false)
      alert('Canção adicionada com sucesso!')
    } catch (error) {
      alert('Erro ao adicionar canção: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta canção?')) return

    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase error:', error)
        alert('Erro ao deletar canção: ' + error.message)
        return
      }

      await fetchSongs()
      alert('Canção deletada com sucesso!')
    } catch (error) {
      alert('Erro ao deletar canção: ' + error.message)
    }
  }

  const filteredSongs = songs.filter((song) => {
    const matchSearch = song.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !selectedCategory || song.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <SongsContainer>
      <PageHeader>
        <PageTitle>CANÇÕES MILITARES</PageTitle>
        <PageSubtitle>Acervo de canções militares, hinos e marchas. Organize, busque e visualize as letras das canções que fazem parte da tradição militar do CFC.</PageSubtitle>
      </PageHeader>

      <ControlsSection>
        <div style={{ display: 'grid', gap: '12px' }}>
          <SearchInput
            type="text"
            placeholder="Buscar por nome da canção..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CategoryFilter>
            <CategoryTag
              active={!selectedCategory}
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </CategoryTag>
            {categories.map((cat) => (
              <CategoryTag
                key={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </CategoryTag>
            ))}
          </CategoryFilter>
        </div>

        <AddButton onClick={() => setShowModal(true)}>
          + ADICIONAR CANÇÃO
        </AddButton>
      </ControlsSection>

      {isLoadingData ? (
        <EmptyState>
          <p>Carregando canções...</p>
        </EmptyState>
      ) : filteredSongs.length > 0 ? (
        <SongsGrid>
          {filteredSongs.map((song) => (
            <SongCard key={song.id}>
              <div>
                <SongTitle>{song.title}</SongTitle>
                <SongMeta>
                  <MetaItem>
                    <strong>Categoria:</strong> {song.category}
                  </MetaItem>
                  <MetaItem>
                    <strong>Data:</strong> {new Date(song.created_at).toLocaleDateString('pt-BR')}
                  </MetaItem>
                </SongMeta>
              </div>
              <LyricsPreview>{song.lyrics}</LyricsPreview>
              <SongActions>
                <ActionButton
                  primary
                  onClick={() => alert(song.lyrics)}
                >
                  📄 Letra Completa
                </ActionButton>
                <ActionButton
                  onClick={() => handleDelete(song.id)}
                >
                  🗑️ Deletar
                </ActionButton>
              </SongActions>
            </SongCard>
          ))}
        </SongsGrid>
      ) : (
        <EmptyState>
          <p>Nenhuma canção encontrada</p>
        </EmptyState>
      )}

      {showModal && (
        <ModalBackdrop onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Adicionar Canção</ModalTitle>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="title">Título da Canção</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Marcha dos Cabos"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="lyrics">Letra</Label>
                <Textarea
                  id="lyrics"
                  value={formData.lyrics}
                  onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                  placeholder="Digite aqui a letra da canção..."
                />
              </FormGroup>

              <ModalActions>
                <ModalButton
                  type="button"
                  cancel
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </ModalButton>
                <ModalButton type="submit">
                  Adicionar
                </ModalButton>
              </ModalActions>
            </form>
          </Modal>
        </ModalBackdrop>
      )}
    </SongsContainer>
  )
}
