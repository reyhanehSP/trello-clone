// src/components/List/List.tsx
"use client";
import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card } from "@/components/Card/Card";
import { CardModal } from "@/components/Card/CardModal";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import styles from "./List.module.scss";
import { IList } from "@/types/Kanban.types";
import { useList } from "@/hooks/useList";

interface ListProps {
  list: IList;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
  onAddCard: (title: string) => void;
  onUpdateCard: (cardId: string, title: string) => void;
  onAddComment: (cardId: string, text: string) => void;
  deleteAllCards: (listId: string) => void;
  showActionsMenu: boolean;
  onToggleActionsMenu: () => void;
}

export const List: React.FC<ListProps> = ({
  list,
  onUpdateTitle,
  onDelete,
  onAddCard,
  onUpdateCard,
  onAddComment,
  deleteAllCards,
  showActionsMenu,
  onToggleActionsMenu,
}) => {
  if (!list) {
    console.error("List component received undefined list");
    return null;
  }

  const cards = list.cards || [];
  const cardIds = cards.map((card) => card?.id || "").filter(Boolean);

  const { dragProps, titleEditing, cardAdding, menu, cardModal } = useList(
    {
      list,
      onUpdateTitle,
      onDelete,
      onAddCard,
      deleteAllCards,
      showActionsMenu,
      onToggleActionsMenu,
    }
  );

  // ===== MENU CONTENT RENDERER =====
  const renderMenuContent = () => {
    switch (menu.state) {
      case "Delete All Cards":
        return (
          <>
            <div className={styles.confirmHeader}>
              <button
                className={styles.backButton}
                onClick={menu.handleBackToMenu}
                type="button"
              >
                ←
              </button>
              <span className={styles.confirmTitle}> Delete all cards</span>
              <button
                className={styles.closeButton}
                onClick={menu.handleCloseMenu}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className={styles.confirmContent}>
              <p>This will remove all the cards in this list from the board.</p>
              <button
                className={styles.deleteConfirmButton}
                onClick={menu.handleDeleteAllCards}
                type="button"
              >
                Delete all cards
              </button>
            </div>
          </>
        );

      case "Delete List":
        return (
          <>
            <div className={styles.confirmHeader}>
              <button
                className={styles.backButton}
                onClick={menu.handleBackToMenu}
                type="button"
              >
                ←
              </button>
              <span className={styles.confirmTitle}>Delete List</span>
              <button
                className={styles.closeButton}
                onClick={menu.handleCloseMenu}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className={styles.confirmContent}>
              <p>
                All actions will be removed from the activity feed and you won’t
                be able to re-open the list. There is no undo.
              </p>
              <button
                className={styles.deleteConfirmButton}
                onClick={menu.handleDeleteList}
                type="button"
              >
                Delete list
              </button>
            </div>
          </>
        );

      default: // 'normal'
        return (
          <>
            <div className={styles.actionTitle}>
              <button></button>
              <h3>List Actions</h3>
              <button onClick={onToggleActionsMenu}>×</button>
            </div>
                <div className={styles.actionBody}>
              <button
                className={styles.actionsMenuItem}
                onClick={() => menu.setState("Delete List")}
                type="button"
              >
                Delete List
              </button>
              <button
                className={styles.actionsMenuItem}
                onClick={() => menu.setState("Delete All Cards")}
                type="button"
              >
                Delete All Cards
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div ref={dragProps.ref} style={dragProps.style} className={styles.list}>
      {/* LIST HEADER */}
      <div
        className={styles.listHeader}
        {...dragProps.attributes}
        {...dragProps.listeners}
      >
        {titleEditing.isEditing ? (
          <Input
            value={titleEditing.title}
            onChange={titleEditing.handleChange}
            onBlur={titleEditing.save}
            onKeyDown={titleEditing.handleKeyDown}
            autoFocus
            className={styles.listTitleInput}
          />
        ) : (
          <h2 className={styles.listTitle} onClick={titleEditing.startEdit}>
            {list.title || "Untitled List"}
          </h2>
        )}

        <button
          className={styles.listDeleteBtn}
          onClick={onToggleActionsMenu}
          title="List actions"
          type="button"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="ellipsis-h"
            className="svg-inline--fa fa-ellipsis-h"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"
            ></path>
          </svg>
        </button>

        {showActionsMenu && (
          <div ref={menu.ref} className={styles.actionsMenu}>
            {renderMenuContent()}
          </div>
        )}
      </div>

      {/* LIST CARDS */}
      <div className={styles.listCards}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.length > 0 &&
            cards.map((card) => {
              if (!card || !card.id) {
                console.warn("Invalid card found in list", card);
                return null;
              }

              return (
                <Card
                  key={card.id}
                  card={card}
                  listId={list.id}
                  onUpdateTitle={(newTitle) => onUpdateCard(card.id, newTitle)}
                  onOpenModal={() => cardModal.openModal(card)}
                />
              );
            })}
        </SortableContext>
      </div>

      {/* LIST FOOTER */}
      <div className={styles.listFooter}>
        {cardAdding.isAdding ? (
          <div className={styles.addCardForm}>
            <Input
              value={cardAdding.newCardTitle}
              onChange={cardAdding.handleChange}
              onKeyDown={cardAdding.handleKeyDown}
              placeholder="Enter card title..."
              autoFocus
            />
         
            <div className={styles.addCardActions}>
              <Button onClick={cardAdding.add} type="button">
                Craete card
              </Button>
              <Button
                variant="secondary"
                onClick={cardAdding.cancel}
                type="button"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            className={styles.addCardBtn}
            onClick={cardAdding.startAdd}
            type="button"
          >
            + Add another card
          </button>
        )}
      </div>

      {/* CARD MODAL */}
      {cardModal.selectedCard && (
        <CardModal
          card={cardModal.selectedCard}
          isOpen={!!cardModal.selectedCard}
          onClose={cardModal.closeModal}
          onUpdateTitle={(newTitle) => {
            onUpdateCard(cardModal.selectedCard!.id, newTitle);
            cardModal.updateSelectedCard(newTitle);
          }}
          onAddComment={(text) => {
            onAddComment(cardModal.selectedCard!.id, text);
          }}
        />
      )}
    </div>
  );
};
